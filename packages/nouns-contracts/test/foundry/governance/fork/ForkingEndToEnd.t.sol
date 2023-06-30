// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsDAOLogicV3 } from '../../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsAuctionHouseFork } from '../../../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsTokenLike } from '../../../../contracts/governance/NounsDAOInterfaces.sol';
import { INounsAuctionHouse } from '../../../../contracts/interfaces/INounsAuctionHouse.sol';

contract ForkingHappyFlowTest is DeployUtilsFork {
    address minter;
    NounsDAOLogicV3 daoV3;
    NounsToken ogToken;
    NounsTokenFork forkToken;
    NounsDAOExecutorV2 forkTreasury;
    NounsDAOLogicV1Fork forkDAO;

    address nounerInEscrow1 = makeAddr('nouner in escrow 1');
    address nounerInEscrow2 = makeAddr('nouner in escrow 2');
    address nounerForkJoiner1 = makeAddr('nouner fork joiner 1');
    address nounerForkJoiner2 = makeAddr('nouner fork joiner 2');
    address nounerNoFork1 = makeAddr('nouner no fork 1');
    address nounerNoFork2 = makeAddr('nouner no fork 2');

    function test_forkHappyFlow() public {
        daoV3 = _deployDAOV3();
        ogToken = NounsToken(address(daoV3.nouns()));
        minter = ogToken.minter();
        dealNouns();
        // Sending the DAO ETH that will be sent to the fork treasury and a key assertion for this test.
        vm.deal(address(daoV3.timelock()), 24 ether);

        uint256[] memory tokensInEscrow1 = getOwnedTokens(nounerInEscrow1);
        uint256[] memory tokensInEscrow2 = getOwnedTokens(nounerInEscrow2);

        // Two Nouner accounts sigaling they want to fork. Their combined tokens meet the forking threshold.
        escrowToFork(nounerInEscrow1);
        escrowToFork(nounerInEscrow2);

        // Execute the fork and get contract addresses for DAO, treasury and token.
        (address forkTreasuryAddress, address forkTokenAddress) = daoV3.executeFork();
        forkTreasury = NounsDAOExecutorV2(payable(forkTreasuryAddress));
        forkToken = NounsTokenFork(forkTokenAddress);
        forkDAO = NounsDAOLogicV1Fork(forkTreasury.admin());

        // Assert the fork treasury has the expected balance, which is the pro rata ETH of the two Nouner accounts that
        // escrowed above. They have 4 Nouns out of a total supply of 12, so a third. DAO balance was 24 ETH, a third
        // of that is 8 ETH.
        assertEqUint(forkTreasuryAddress.balance, 8 ether);

        // Governance is blocked during forking period
        vm.expectRevert(NounsDAOLogicV1Fork.GovernanceBlockedDuringForkingPeriod.selector);
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        // Two additional Nouners join the fork during the forking period.
        // This should grow the ETH balance sent from OG DAO to fork DAO.
        joinFork(nounerForkJoiner1);
        joinFork(nounerForkJoiner2);

        // Forking period finished
        vm.warp(forkToken.forkingPeriodEndTimestamp());

        // Asserting that delayed governance is working - no one should be able to propose until all fork tokens have
        // been claimed, or until the delay period expires.
        // Later in this test we make sure we CAN propose once all tokens have been claimed.
        vm.expectRevert(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector);
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        // Asserting the expected ETH amount was sent. We're now at two thirds of OG Nouns forking, so we expect
        // two thirds of the ETH to be sent, which is 16 out of the original 24.
        assertEqUint(forkTreasuryAddress.balance, 16 ether);

        // This Nouner is going to vanilla-ragequit soon, so making it explicit their ETH balance is zero before
        // so the next balance assertion is clearly new ETH they received from quitting the fork DAO.
        assertEqUint(nounerInEscrow1.balance, 0);

        // The Nouners that originally escrowed their Nouns, now claiming their new fork tokens.
        vm.prank(nounerInEscrow1);
        forkToken.claimFromEscrow(tokensInEscrow1);
        vm.prank(nounerInEscrow2);
        forkToken.claimFromEscrow(tokensInEscrow2);
        vm.roll(block.number + 1);

        // Demonstrating we're able to submit a proposal now that all claimable tokens have been claimed and
        // forking period is over
        vm.startPrank(nounerInEscrow1);
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        // This Nouner executes quit, and we assert they received the expected ETH; it's a quarter of the fork
        // DAO balance (4 Nouners with equal token balances, 1 quits), so 4 ETH of the 16 ETH balance.
        forkToken.setApprovalForAll(address(forkDAO), true);
        forkDAO.quit(tokensInEscrow1);
        assertEqUint(nounerInEscrow1.balance, 4 ether);
    }

    function dealNouns() internal {
        address nounders = ogToken.noundersDAO();
        vm.startPrank(minter);
        for (uint256 i = 0; i < 10; i++) {
            ogToken.mint();
        }

        changePrank(nounders);
        ogToken.transferFrom(nounders, nounerInEscrow1, 0);

        changePrank(minter);
        ogToken.transferFrom(minter, nounerInEscrow1, 1);
        ogToken.transferFrom(minter, nounerInEscrow2, 2);
        ogToken.transferFrom(minter, nounerInEscrow2, 3);
        ogToken.transferFrom(minter, nounerForkJoiner1, 4);
        ogToken.transferFrom(minter, nounerForkJoiner1, 5);
        ogToken.transferFrom(minter, nounerForkJoiner2, 6);
        ogToken.transferFrom(minter, nounerForkJoiner2, 7);
        ogToken.transferFrom(minter, nounerNoFork1, 8);
        ogToken.transferFrom(minter, nounerNoFork1, 9);

        changePrank(nounders);
        ogToken.transferFrom(nounders, nounerNoFork2, 10);

        changePrank(minter);
        ogToken.transferFrom(minter, nounerNoFork2, 11);

        vm.stopPrank();
    }

    function escrowToFork(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.escrowToFork(getOwnedTokens(nouner), new uint256[](0), '');
        vm.stopPrank();
    }

    function joinFork(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.joinFork(getOwnedTokens(nouner), new uint256[](0), '');
        vm.stopPrank();
    }

    function getOwnedTokens(address nouner) internal view returns (uint256[] memory tokenIds) {
        uint256 balance = ogToken.balanceOf(nouner);
        tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = ogToken.tokenOfOwnerByIndex(nouner, i);
        }
    }

    function proposeToFork(
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
        proposalId = forkDAO.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}

abstract contract ForkDAOBase is DeployUtilsFork {
    NounsDAOLogicV3 originalDAO;
    NounsTokenLike originalToken;
    NounsDAOLogicV1Fork forkDAO;
    NounsDAOExecutorV2 forkTreasury;
    NounsTokenFork forkToken;
    NounsAuctionHouseFork forkAuction;

    address originalNouner = makeAddr('original nouner');
    address newNouner = makeAddr('new nouner');
    address proposalRecipient = makeAddr('recipient');
    address joiningNouner = makeAddr('joining nouner');

    function setUp() public virtual {
        originalDAO = _deployDAOV3();
        originalToken = originalDAO.nouns();
        address originalMinter = originalToken.minter();
        vm.startPrank(address(originalDAO.timelock()));
        NounsAuctionHouseFork(originalMinter).unpause();
        vm.stopPrank();

        vm.deal(originalNouner, 1 ether);
        vm.deal(joiningNouner, 1 ether);

        bidAndSettleOriginalAuction(originalNouner);
        bidAndSettleOriginalAuction(originalNouner);

        vm.startPrank(originalNouner);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        originalToken.setApprovalForAll(address(originalDAO), true);
        originalDAO.escrowToFork(tokenIds, new uint256[](0), '');

        (address treasuryAddress, address tokenAddress) = originalDAO.executeFork();

        forkTreasury = NounsDAOExecutorV2(payable(treasuryAddress));
        forkDAO = NounsDAOLogicV1Fork(forkTreasury.admin());
        forkToken = NounsTokenFork(tokenAddress);
        forkAuction = NounsAuctionHouseFork(forkToken.minter());

        forkToken.claimFromEscrow(tokenIds);
        vm.stopPrank();
        vm.roll(block.number + 1);
    }

    function bidAndSettleForkAuction(address buyer) internal {
        bidAndSettleAuction(forkAuction, buyer);
    }

    function bidAndSettleOriginalAuction(address buyer) internal {
        bidAndSettleAuction(NounsAuctionHouseFork(originalToken.minter()), buyer);
    }

    function bidAndSettleAuction(NounsAuctionHouseFork auctionHouse, address buyer) internal {
        vm.startPrank(buyer);
        INounsAuctionHouse.Auction memory auction = getAuction(auctionHouse);
        uint256 newNounId = auction.nounId;
        auctionHouse.createBid{ value: 0.1 ether }(newNounId);
        vm.warp(block.timestamp + auction.endTime);
        auctionHouse.settleCurrentAndCreateNewAuction();
        assertEq(auctionHouse.nouns().ownerOf(newNounId), buyer);
        vm.roll(block.number + 1);
        vm.stopPrank();
    }

    function getAuction(NounsAuctionHouseFork auctionHouse) internal view returns (INounsAuctionHouse.Auction memory) {
        (
            uint256 nounId,
            uint256 amount,
            uint256 startTime,
            uint256 endTime,
            address payable bidder,
            bool settled
        ) = auctionHouse.auction();

        return INounsAuctionHouse.Auction(nounId, amount, startTime, endTime, bidder, settled);
    }

    function proposeToForkAndRollToVoting(
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
        proposalId = forkDAO.propose(targets, values, signatures, calldatas, 'my proposal');
        vm.roll(block.number + forkDAO.votingDelay() + 1);
    }

    function queueAndExecute(uint256 propId) internal {
        vm.roll(block.number + forkDAO.votingPeriod());
        forkDAO.queue(propId);
        vm.warp(block.timestamp + forkTreasury.delay());
        forkDAO.execute(propId);
    }
}

abstract contract ForkDAOPostForkingPeriodBase is ForkDAOBase {
    function setUp() public virtual override {
        super.setUp();

        vm.warp(forkToken.forkingPeriodEndTimestamp());
    }
}

contract ForkDAOProposalAndAuctionHappyFlowTest is ForkDAOPostForkingPeriodBase {
    function test_resumeAuctionViaProposal_buyOnAuctionAndPropose() public {
        // Execute the proposal to resume the auction
        vm.startPrank(originalNouner);
        uint256 unpauseAuctionPropId = proposeToForkAndRollToVoting(address(forkAuction), 0, 'unpause()', '');
        forkDAO.castVote(unpauseAuctionPropId, 1);
        queueAndExecute(unpauseAuctionPropId);

        // Buy a fork noun on auction as newNouner
        vm.deal(newNouner, 1 ether);
        vm.stopPrank();
        bidAndSettleForkAuction(newNouner);

        // Execute a proposal created by newNouner
        vm.startPrank(newNouner);
        vm.deal(address(forkTreasury), 0.142 ether);
        uint256 transferProp = proposeToForkAndRollToVoting(proposalRecipient, 0.142 ether, '', '');
        forkDAO.castVote(transferProp, 1);
        queueAndExecute(transferProp);
        vm.stopPrank();

        assertEq(proposalRecipient.balance, 0.142 ether);
    }
}

contract ForkDAOCanUpgradeItsTokenTest is ForkDAOPostForkingPeriodBase {
    function test_upgradeTokenWorks() public {
        vm.expectRevert();
        TokenUpgrade(address(forkToken)).theUpgradeWorked();

        TokenUpgrade newTokenLogic = new TokenUpgrade();
        vm.startPrank(originalNouner);
        uint256 propId = proposeToForkAndRollToVoting(
            address(forkToken),
            0,
            'upgradeTo(address)',
            abi.encode(newTokenLogic)
        );
        forkDAO.castVote(propId, 1);
        queueAndExecute(propId);

        assertTrue(TokenUpgrade(address(forkToken)).theUpgradeWorked());
    }
}

contract ForkDAO_PostFork_NewOGNounsJoin is ForkDAOBase {
    function test_forkAuctionHouseUnpauseWorks() public {
        // buy new nouns on auction
        bidAndSettleOriginalAuction(joiningNouner);
        bidAndSettleOriginalAuction(joiningNouner);

        // join the fork with new noun IDs
        vm.startPrank(joiningNouner);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 3;
        tokenIds[1] = 4;
        originalToken.setApprovalForAll(address(originalDAO), true);
        originalDAO.joinFork(tokenIds, new uint256[](0), '');

        vm.warp(forkToken.forkingPeriodEndTimestamp());

        // unpause auction, which calls mint, which should work if token's _currentNounId is set correctly
        changePrank(originalNouner);
        uint256 unpauseAuctionPropId = proposeToForkAndRollToVoting(address(forkAuction), 0, 'unpause()', '');
        forkDAO.castVote(unpauseAuctionPropId, 1);
        queueAndExecute(unpauseAuctionPropId);

        // if the unpause tx fails because of a failed mint, auction house pauses itself
        assertFalse(forkAuction.paused());
        assertEq(getAuction(forkAuction).nounId, 5);
    }
}

contract TokenUpgrade is NounsTokenFork {
    function theUpgradeWorked() public pure returns (bool) {
        return true;
    }
}
