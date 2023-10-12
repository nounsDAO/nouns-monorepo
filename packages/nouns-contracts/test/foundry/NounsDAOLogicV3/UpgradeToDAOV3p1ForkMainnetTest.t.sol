// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { ProposeDAOV3p1UpgradeMainnet } from '../../../script/DAOLogicV3p1/ProposeDAOV3p1UpgradeMainnet.s.sol';
import { DeployDAOV3p1 } from '../../../script/DAOLogicV3p1/DeployDAOV3p1.s.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { IForkDAODeployer, INounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { AuctionHouseUpgrader } from '../helpers/AuctionHouseUpgrader.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

contract UpgradeToDAOV3p1ForkMainnetTest is Test {
    error NounIdNotOldEnough();

    NounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV3(payable(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d));
    INounsDAOExecutorV2 public constant NOUNS_TIMELOCK_MAINNET =
        INounsDAOExecutorV2(0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71);
    INounsAuctionHouseV2 public constant AUCTION_HOUSE_PROXY_MAINNET =
        INounsAuctionHouseV2(0x830BD73E4184ceF73443C15111a1DF14e495C706);
    NounsAuctionHouseProxyAdmin public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET =
        NounsAuctionHouseProxyAdmin(0xC1C119932d78aB9080862C5fcb964029f086401e);
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    uint256 proposalId;
    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    address whaleAddr = 0xFC218F1164cfEf8e4EC7c2aca8fB019DC8976214;

    NounsDAOLogicV3 newImpl;
    IForkDAODeployer forkDeployerBefore;
    address[] erc20sBefore;

    function setUp() public {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 18336146);

        // The new code assumes AuctionHouseV2, so upgrading before
        AuctionHouseUpgrader.upgradeAuctionHouse(
            address(NOUNS_TIMELOCK_MAINNET),
            AUCTION_HOUSE_PROXY_ADMIN_MAINNET,
            address(AUCTION_HOUSE_PROXY_MAINNET)
        );

        // give ourselves voting power
        vm.prank(NOUNDERS);
        nouns.delegate(proposerAddr);

        vm.roll(block.number + 1);

        // save state values before the upgrade
        forkDeployerBefore = NOUNS_DAO_PROXY_MAINNET.forkDAODeployer();
        erc20sBefore = NOUNS_DAO_PROXY_MAINNET.erc20TokensToIncludeInFork();

        // deploy contracts
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        newImpl = new DeployDAOV3p1().run();

        // propose upgrade
        ProposeDAOV3p1UpgradeMainnet upgradePropScript = new ProposeDAOV3p1UpgradeMainnet();
        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        vm.setEnv('DAO_V3p1_IMPL', Strings.toHexString(uint160(address(newImpl)), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/NounsDAOLogicV3/proposal-description.txt');

        proposalId = upgradePropScript.run();

        // simulate vote & proposal execution
        voteAndExecuteProposal();

        AUCTION_HOUSE_PROXY_MAINNET.settleCurrentAndCreateNewAuction();
    }

    function test_forkDeployerDidNotChange() public {
        assertEq(address(NOUNS_DAO_PROXY_MAINNET.forkDAODeployer()), address(forkDeployerBefore));
    }

    function test_erc20sDidNotChange() public {
        address[] memory erc20sAfter = NOUNS_DAO_PROXY_MAINNET.erc20TokensToIncludeInFork();
        assertEq(erc20sBefore.length, erc20sAfter.length);

        for (uint256 i = 0; i < erc20sBefore.length; i++) {
            assertEq(erc20sBefore[i], erc20sAfter[i]);
        }
    }

    function test_nounAgeRequiredToForkIsZero() public {
        assertEq(NOUNS_DAO_PROXY_MAINNET.nounAgeRequiredToFork(), 0);
    }

    function test_givenRequiredAgeZero_MostRecentNounCanEscrow() public {
        address forker = makeAddr('forker');
        uint256 nounId = winCurrentAuction(forker);

        escrowToFork(forker, nounId);
    }

    function test_givenRequiredAgeGreaterThanZero_AnOldEnoughNounCanEscrow() public {
        vm.prank(address(NOUNS_DAO_PROXY_MAINNET.timelock()));
        NOUNS_DAO_PROXY_MAINNET._setNounAgeRequiredToFork(1);

        address forker = makeAddr('forker');
        uint256 nounId = winCurrentAuction(forker);

        // skipping an auction to make the noun in question old enough
        winCurrentAuction(forker);

        escrowToFork(forker, nounId);
    }

    function test_givenRequiredAgeGreaterThanZero_MostRecentNounEscrowReverts() public {
        vm.prank(address(NOUNS_DAO_PROXY_MAINNET.timelock()));
        NOUNS_DAO_PROXY_MAINNET._setNounAgeRequiredToFork(1);

        address forker = makeAddr('forker');
        uint256 nounId = winCurrentAuction(forker);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = nounId;
        uint256[] memory proposalIds = new uint256[](0);
        string memory reason = '';

        vm.startPrank(forker);
        nouns.setApprovalForAll(address(NOUNS_DAO_PROXY_MAINNET), true);

        vm.expectRevert(NounIdNotOldEnough.selector);
        NOUNS_DAO_PROXY_MAINNET.escrowToFork(tokenIds, proposalIds, reason);
        vm.stopPrank();
    }

    function voteAndExecuteProposal() internal {
        vm.roll(
            block.number +
                NOUNS_DAO_PROXY_MAINNET.proposalUpdatablePeriodInBlocks() +
                NOUNS_DAO_PROXY_MAINNET.votingDelay() +
                1
        );
        vm.prank(proposerAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);
        vm.prank(whaleAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);

        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingPeriod() + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        vm.warp(block.timestamp + NOUNS_TIMELOCK_MAINNET.delay());
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }

    function winCurrentAuction(address bidder) internal returns (uint256) {
        uint256 bidValue = 0.01 ether;
        vm.deal(bidder, bidValue);
        uint256 currentAuctionID = AUCTION_HOUSE_PROXY_MAINNET.auction().nounId;

        vm.prank(bidder);
        AUCTION_HOUSE_PROXY_MAINNET.createBid{ value: bidValue }(currentAuctionID);
        vm.warp(block.timestamp + AUCTION_HOUSE_PROXY_MAINNET.auction().endTime + 1);
        AUCTION_HOUSE_PROXY_MAINNET.settleCurrentAndCreateNewAuction();

        return currentAuctionID;
    }

    function escrowToFork(address forker, uint256 nounId) internal {
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = nounId;
        uint256[] memory proposalIds = new uint256[](0);
        string memory reason = '';

        vm.startPrank(forker);
        nouns.setApprovalForAll(address(NOUNS_DAO_PROXY_MAINNET), true);
        NOUNS_DAO_PROXY_MAINNET.escrowToFork(tokenIds, proposalIds, reason);
        vm.stopPrank();
    }
}
