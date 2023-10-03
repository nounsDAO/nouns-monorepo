// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsExcessETHBurner } from '../helpers/DeployUtilsExcessETHBurner.sol';
import { NounsDAOExecutorV3 } from '../../../contracts/governance/NounsDAOExecutorV3.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsTokenLike } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { ExcessETHBurner, INounsAuctionHouseV2 } from '../../../contracts/governance/ExcessETHBurner.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';

contract NounsDAOExecutorV3Test is DeployUtilsExcessETHBurner {
    event ETHBurned(uint256 amount);

    NounsDAOExecutorV3 treasury;
    address burner = makeAddr('burner');

    address dao = makeAddr('dao');

    function setUp() public {
        treasury = _deployExecutorV3(dao);

        vm.prank(address(treasury));
        treasury.setExcessETHBurner(burner);
    }

    function test_setExcessETHBurner_revertsForNonTreasury() public {
        vm.expectRevert('NounsDAOExecutor::setExcessETHBurner: Call must come from NounsDAOExecutor.');
        treasury.setExcessETHBurner(burner);
    }

    function test_setExcessETHBurner_worksForTreasury() public {
        address newBurner = makeAddr('newBurner');

        assertTrue(treasury.excessETHBurner() != newBurner);

        vm.prank(address(treasury));
        treasury.setExcessETHBurner(newBurner);

        assertEq(treasury.excessETHBurner(), newBurner);
    }

    function test_burnExcessETH_revertsForNonBurner() public {
        vm.expectRevert(NounsDAOExecutorV3.OnlyExcessETHBurner.selector);
        treasury.burnExcessETH(1);
    }

    function test_burnExcessETH_worksForBurner() public {
        vm.deal(address(treasury), 142 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHBurned(142 ether);

        vm.prank(burner);
        treasury.burnExcessETH(142 ether);

        assertEq(treasury.totalETHBurned(), 142 ether);
        assertEq(address(treasury).balance, 0);
    }

    function test_burnExcessETH_addsToTotalETHBurned() public {
        vm.deal(address(treasury), 142 ether);

        vm.prank(burner);
        treasury.burnExcessETH(100 ether);
        assertEq(treasury.totalETHBurned(), 100 ether);

        vm.prank(burner);
        treasury.burnExcessETH(42 ether);
        assertEq(treasury.totalETHBurned(), 142 ether);
    }
}

contract NounsDAOExecutorV3_UpgradeTest is DeployUtilsExcessETHBurner {
    event ETHBurned(uint256 amount);

    NounsDAOLogicV3 dao;
    address payable treasury;
    NounsAuctionHouseV2 auction;

    address nouner = makeAddr('nouner');

    function setUp() public {
        dao = _deployDAOV3();
        treasury = payable(address(dao.timelock()));

        upgradeAuction();
        auction = NounsAuctionHouseV2(payable(dao.nouns().minter()));
        vm.prank(auction.owner());
        auction.unpause();

        vm.deal(nouner, 1 ether);

        // After this auction total supply is 3:
        // ID 0 went to nounders
        // 1 going to nouner now
        // 2 born after this auction is settled, in this same tx
        bidAndWinCurrentAuction(nouner, 1 ether);
        vm.roll(block.number + 1);
    }

    function test_upgardeViaProposal_andBurnHappyFlow() public {
        uint256 meanPrice = 0.1 ether;
        generateAuctionHistory(90, meanPrice);

        NounsDAOExecutorV3 newImpl = new NounsDAOExecutorV3();

        vm.startPrank(nouner);
        uint256 proposalId = propose(treasury, 0, 'upgradeTo(address)', abi.encode(address(newImpl)));
        getProposalToExecution(proposalId);
        vm.stopPrank();

        uint128 currentNounID = auction.auction().nounId;

        ExcessETHBurner burner = _deployExcessETHBurner(
            NounsDAOExecutorV3(treasury),
            INounsAuctionHouseV2(dao.nouns().minter()),
            currentNounID + 100,
            100,
            90
        );

        vm.startPrank(nouner);
        proposalId = propose(treasury, 0, 'setExcessETHBurner(address)', abi.encode(address(burner)));
        getProposalToExecution(proposalId);
        vm.stopPrank();

        vm.expectRevert(ExcessETHBurner.NotTimeToBurnYet.selector);
        burner.burnExcessETH();

        auction.settleCurrentAndCreateNewAuction();
        generateAuctionHistory(100, meanPrice);

        vm.expectRevert(ExcessETHBurner.NoExcessToBurn.selector);
        burner.burnExcessETH();

        vm.deal(address(treasury), 100 ether);

        // adjustedSupply: 214
        // meanPrice: 0.1 ether
        // expected value: 214 * 0.1 = 21.4 ETH
        // treasury size: 100 ETH
        // excess: 100 - 21.4 = 78.6 ETH
        vm.expectEmit(true, true, true, true);
        emit ETHBurned(78.6 ether);

        uint256 burnedETH = burner.burnExcessETH();
        assertEq(burnedETH, 78.6 ether);
    }

    function getProposalToExecution(uint256 proposalId) internal {
        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);
        dao.castVote(proposalId, 1);
        vm.roll(block.number + dao.votingPeriod() + 1);
        dao.queue(proposalId);
        vm.warp(block.timestamp + NounsDAOExecutorV2(treasury).delay() + 1);
        dao.execute(proposalId);
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = dao.propose(targets, values, signatures, calldatas, 'my proposal');
    }

    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    function upgradeAuction() internal {
        bytes32 proxyAdminBytes = vm.load(address(dao.nouns().minter()), _ADMIN_SLOT);
        address proxyAdminAddress = address(uint160(uint256(proxyAdminBytes)));
        _upgradeAuctionHouse(
            treasury,
            NounsAuctionHouseProxyAdmin(proxyAdminAddress),
            NounsAuctionHouseProxy(payable(dao.nouns().minter()))
        );
    }

    function generateAuctionHistory(uint256 count, uint256 meanPrice) internal {
        vm.deal(nouner, count * meanPrice);
        for (uint256 i = 0; i < count; ++i) {
            bidAndWinCurrentAuction(nouner, meanPrice);
        }
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        INounsAuctionHouseV2.AuctionV2 memory auction_ = auction.auction();
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(auction_.nounId);
        vm.warp(auction_.endTime);
        auction.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }
}
