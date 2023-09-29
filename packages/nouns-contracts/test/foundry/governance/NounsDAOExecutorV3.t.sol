// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsExcessETH } from '../helpers/DeployUtilsExcessETH.sol';
import { NounsDAOExecutorV3 } from '../../../contracts/governance/NounsDAOExecutorV3.sol';
import { IExcessETH } from '../../../contracts/interfaces/IExcessETH.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsTokenLike } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { ExcessETH, INounsAuctionHouseV2 } from '../../../contracts/governance/ExcessETH.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';

contract ExcessETHMock is IExcessETH {
    uint256 excess;

    function setExcess(uint256 excess_) public {
        excess = excess_;
    }

    function excessETH() public view returns (uint256) {
        return excess;
    }
}

contract NounsDAOExecutorV3Test is DeployUtilsExcessETH {
    event ETHBurned(uint256 amount);

    NounsDAOExecutorV3 treasury;
    ExcessETHMock excessETH;

    address dao = makeAddr('dao');

    function setUp() public {
        treasury = _deployExecutorV3(dao);
        excessETH = new ExcessETHMock();

        vm.prank(address(treasury));
        treasury.setExcessETHHelper(excessETH);
    }

    function test_setExcessETHHelper_revertsForNonTreasury() public {
        vm.expectRevert('NounsDAOExecutor::setExcessETHHelper: Call must come from NounsDAOExecutor.');
        treasury.setExcessETHHelper(excessETH);
    }

    function test_setExcessETHHelper_worksForTreasury() public {
        ExcessETHMock newExcessETH = new ExcessETHMock();

        assertTrue(address(treasury.excessETHHelper()) != address(newExcessETH));

        vm.prank(address(treasury));
        treasury.setExcessETHHelper(newExcessETH);

        assertEq(address(treasury.excessETHHelper()), address(newExcessETH));
    }

    function test_burnExcessETH_givenHelperNotSet_reverts() public {
        vm.prank(address(treasury));
        treasury.setExcessETHHelper(IExcessETH(address(0)));

        vm.expectRevert(abi.encodeWithSelector(NounsDAOExecutorV3.ExcessETHHelperNotSet.selector));
        treasury.burnExcessETH();
    }

    function test_burnExcessETH_givenExcessIsZero_reverts() public {
        excessETH.setExcess(0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOExecutorV3.NoExcessToBurn.selector));
        treasury.burnExcessETH();
    }

    function test_burnExcessETH_givenExcess_burnsAddsToTotalAndEmits() public {
        vm.deal(address(treasury), 142 ether);
        excessETH.setExcess(100 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHBurned(100 ether);

        treasury.burnExcessETH();
        assertEq(treasury.totalETHBurned(), 100 ether);

        excessETH.setExcess(42 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHBurned(42 ether);

        treasury.burnExcessETH();
        assertEq(treasury.totalETHBurned(), 142 ether);
    }
}

contract NounsDAOExecutorV3_UpgradeTest is DeployUtilsExcessETH {
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

        NounsTokenLike nouns = dao.nouns();

        vm.startPrank(nouns.minter());
        for (uint256 i = 0; i < 2; i++) {
            uint256 tokenId = nouns.mint();
            nouns.transferFrom(nouns.minter(), nouner, tokenId);
        }
        vm.stopPrank();
        vm.roll(block.number + 1);
    }

    function test_upgardeViaProposal() public {
        generateAuctionHistory(90);

        NounsDAOExecutorV3 newImpl = new NounsDAOExecutorV3();

        vm.startPrank(nouner);
        uint256 proposalId = propose(treasury, 0, 'upgradeTo(address)', abi.encode(address(newImpl)));
        getProposalToExecution(proposalId);
        vm.stopPrank();

        ExcessETH excessETH = _deployExcessETH(
            NounsDAOExecutorV3(treasury),
            INounsAuctionHouseV2(dao.nouns().minter()),
            block.timestamp + 90 days,
            90
        );

        vm.startPrank(nouner);
        proposalId = propose(treasury, 0, 'setExcessETHHelper(address)', abi.encode(address(excessETH)));
        getProposalToExecution(proposalId);
        vm.stopPrank();

        vm.expectRevert(abi.encodeWithSelector(NounsDAOExecutorV3.NoExcessToBurn.selector));
        NounsDAOExecutorV3(treasury).burnExcessETH();

        vm.warp(block.timestamp + 91 days);
        vm.deal(address(treasury), 100 ether);

        NounsDAOExecutorV3(treasury).burnExcessETH();

        // TODO assert the right amount was burned
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

    function generateAuctionHistory(uint256 count) internal {
        NounsAuctionHouseV2 auction = NounsAuctionHouseV2(payable(dao.nouns().minter()));

        vm.deal(nouner, count * 0.1 ether);
        for (uint256 i = 0; i < count; ++i) {
            bidAndWinCurrentAuction(nouner, 0.1 ether);
        }
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        (uint256 nounId, , , uint256 endTime, , ) = auction.auction();
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }
}
