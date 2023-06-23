// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import 'forge-std/Common.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsDAOLogicV3 } from '../../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsDAOStorageV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOStorageV1Fork.sol';
import { NounsDAOForkEscrowMock } from '../../helpers/NounsDAOForkEscrowMock.sol';
import { NounsTokenLikeMock } from '../../helpers/NounsTokenLikeMock.sol';
import { NounsTokenLike } from '../../../../contracts/governance/NounsDAOInterfaces.sol';
import { ERC20Mock, IERC20Receiver } from '../../helpers/ERC20Mock.sol';
import { MaliciousForkDAOQuitter } from '../../helpers/MaliciousForkDAOQuitter.sol';
import { NounsAuctionHouse } from '../../../../contracts/NounsAuctionHouse.sol';
import { INounsAuctionHouse } from '../../../../contracts/interfaces/INounsAuctionHouse.sol';

abstract contract NounsDAOLogicV1ForkBase is DeployUtilsFork {
    NounsDAOLogicV1Fork dao;
    address timelock;
    NounsTokenFork token;
    address proposer = makeAddr('proposer');

    function setUp() public virtual {
        (address treasuryAddress, address tokenAddress, address daoAddress) = _deployForkDAO();
        dao = NounsDAOLogicV1Fork(daoAddress);
        token = NounsTokenFork(tokenAddress);
        timelock = treasuryAddress;

        // a block buffer so prop.startBlock - votingDelay might land on a valid block.
        // in the old way of calling getPriorVotes in vote casting.
        vm.roll(block.number + 1);

        vm.startPrank(token.minter());
        token.mint();
        token.transferFrom(token.minter(), proposer, 0);
        vm.stopPrank();

        vm.roll(block.number + 1);
    }

    function propose() internal returns (uint256) {
        return propose(address(1), 0, 'signature', '');
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        return dao.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}

contract NounsDAOLogicV1Fork_setErc20TokensToIncludeInQuit_Test is NounsDAOLogicV1ForkBase {
    event ERC20TokensToIncludeInQuitSet(address[] oldErc20Tokens, address[] newErc20tokens);

    function test_givenDuplicateAddressesInInput_reverts() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(42);
        tokens[1] = address(42);

        vm.prank(address(dao.timelock()));
        vm.expectRevert(NounsDAOLogicV1Fork.DuplicateTokenAddress.selector);
        dao._setErc20TokensToIncludeInQuit(tokens);
    }

    function test_givenNoDuplicatesInInput_works() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(42);
        tokens[1] = address(43);

        vm.expectEmit(true, true, true, true);
        emit ERC20TokensToIncludeInQuitSet(new address[](0), tokens);

        vm.prank(address(dao.timelock()));
        dao._setErc20TokensToIncludeInQuit(tokens);

        assertEq(dao.erc20TokensToIncludeInQuit(0), address(42));
        assertEq(dao.erc20TokensToIncludeInQuit(1), address(43));
    }

    function test_allowsEmptyArray() public {
        address[] memory tokens = new address[](0);

        vm.expectEmit(true, true, true, true);
        emit ERC20TokensToIncludeInQuitSet(new address[](0), tokens);

        vm.prank(address(dao.timelock()));
        dao._setErc20TokensToIncludeInQuit(tokens);

        assertEq(dao.erc20TokensToIncludeInQuitArray(), tokens);
    }
}

contract NounsDAOLogicV1Fork_votingDelayBugFix_Test is NounsDAOLogicV1ForkBase {
    uint256 proposalId;
    uint256 creationBlock;

    function setUp() public override {
        super.setUp();

        vm.warp(token.forkingPeriodEndTimestamp());

        proposalId = propose();
        creationBlock = block.number;

        vm.roll(block.number + dao.votingDelay() + 1);
    }

    function test_propose_savesCreationBlockAsExpected() public {
        assertEq(dao.proposals(proposalId).creationBlock, creationBlock);
    }

    function test_proposeAndCastVote_voteCountedAsExpected() public {
        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        assertEq(dao.proposals(proposalId).forVotes, 1);
    }

    function test_proposeAndCastVote_editingVotingDelayDoesntChangeVoteCount() public {
        vm.startPrank(address(dao.timelock()));
        dao._setVotingDelay(dao.votingDelay() + 3);

        changePrank(proposer);
        dao.castVote(proposalId, 1);

        assertEq(dao.proposals(proposalId).forVotes, 1);
    }
}

contract NounsDAOLogicV1Fork_cancelProposalUnderThresholdBugFix_Test is NounsDAOLogicV1ForkBase {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.warp(token.forkingPeriodEndTimestamp());

        vm.prank(timelock);
        dao._setProposalThresholdBPS(1_000);

        vm.startPrank(token.minter());
        for (uint256 i = 0; i < 9; ++i) {
            token.mint();
        }
        token.transferFrom(token.minter(), proposer, 1);
        vm.stopPrank();
        vm.roll(block.number + 1);

        proposalId = propose();
    }

    function test_cancel_nonProposerCanCancelWhenProposerBalanceEqualsThreshold() public {
        vm.prank(proposer);
        token.transferFrom(proposer, address(1), 1);
        vm.roll(block.number + 1);
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold());

        vm.prank(makeAddr('not proposer'));
        dao.cancel(proposalId);

        assertTrue(dao.proposals(proposalId).canceled);
    }

    function test_cancel_nonProposerCanCancelWhenProposerBalanceIsLessThanThreshold() public {
        vm.startPrank(proposer);
        token.transferFrom(proposer, address(1), 0);
        token.transferFrom(proposer, address(1), 1);
        vm.roll(block.number + 1);
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold() - 1);

        changePrank(makeAddr('not proposer'));
        dao.cancel(proposalId);

        assertTrue(dao.proposals(proposalId).canceled);
    }

    function test_cancel_nonProposerCannotCancelWhenProposerBalanceIsGtThreshold() public {
        assertEq(token.getPriorVotes(proposer, block.number - 1), dao.proposalThreshold() + 1);

        vm.startPrank(makeAddr('not proposer'));
        vm.expectRevert('NounsDAO::cancel: proposer above threshold');
        dao.cancel(proposalId);
    }
}

abstract contract ForkWithEscrow is NounsDAOLogicV1ForkBase {
    NounsDAOForkEscrowMock escrow;
    NounsTokenLike originalToken;
    NounsDAOLogicV3 originalDAO;

    address owner1 = makeAddr('owner1');

    function setUp() public virtual override {
        originalDAO = _deployDAOV3();
        originalToken = originalDAO.nouns();
        NounsAuctionHouse originalMinter = NounsAuctionHouse(originalToken.minter());

        // Minting original tokens
        vm.prank(address(originalDAO.timelock()));
        originalMinter.unpause();
        bidAndSettleAuction(originalMinter, proposer);
        bidAndSettleAuction(originalMinter, owner1);
        assertEq(originalToken.ownerOf(1), proposer);
        assertEq(originalToken.ownerOf(2), owner1);

        // Escrowing original tokens
        vm.startPrank(proposer);
        originalToken.setApprovalForAll(address(originalDAO), true);
        uint256[] memory proposerTokens = new uint256[](1);
        proposerTokens[0] = 1;
        originalDAO.escrowToFork(proposerTokens, new uint256[](0), '');

        changePrank(owner1);
        originalToken.setApprovalForAll(address(originalDAO), true);
        uint256[] memory owner1Tokens = new uint256[](1);
        owner1Tokens[0] = 2;
        originalDAO.escrowToFork(owner1Tokens, new uint256[](0), '');

        vm.stopPrank();

        (address treasuryAddress, address tokenAddress, address daoAddress) = _deployForkDAO(originalDAO.forkEscrow());

        dao = NounsDAOLogicV1Fork(daoAddress);
        token = NounsTokenFork(tokenAddress);
        timelock = treasuryAddress;
    }

    function bidAndSettleAuction(NounsAuctionHouse auctionHouse, address buyer) internal {
        vm.deal(buyer, buyer.balance + 0.1 ether);
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

    function getAuction(NounsAuctionHouse auctionHouse) internal view returns (INounsAuctionHouse.Auction memory) {
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
}

contract NounsDAOLogicV1Fork_DelayedGovernance_Test is ForkWithEscrow {
    function setUp() public override {
        super.setUp();

        vm.warp(token.forkingPeriodEndTimestamp());
    }

    function test_propose_givenFullClaim_duringForkingPeriod_reverts() public {
        vm.warp(token.forkingPeriodEndTimestamp() - 1);

        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.prank(proposer);
        token.claimFromEscrow(tokens);

        tokens[0] = 2;
        vm.prank(owner1);
        token.claimFromEscrow(tokens);

        // mining one block so proposer prior votes getter sees their tokens.
        vm.roll(block.number + 1);

        vm.expectRevert(NounsDAOLogicV1Fork.GovernanceBlockedDuringForkingPeriod.selector);
        propose();
    }

    function test_quit_givenFullClaim_duringForkingPeriod_reverts() public {
        vm.warp(token.forkingPeriodEndTimestamp() - 1);

        vm.deal(timelock, 10 ether);
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 2;
        vm.prank(owner1);
        token.claimFromEscrow(tokens);

        vm.startPrank(proposer);
        tokens[0] = 1;
        token.claimFromEscrow(tokens);

        token.setApprovalForAll(address(dao), true);

        vm.expectRevert(NounsDAOLogicV1Fork.GovernanceBlockedDuringForkingPeriod.selector);
        dao.quit(tokens);
    }

    function test_propose_givenTokenToClaim_reverts() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        propose();
    }

    function test_propose_givenPartialClaim_reverts() public {
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.prank(proposer);
        token.claimFromEscrow(tokens);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        propose();
    }

    function test_propose_givenFullClaim_works() public {
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.prank(proposer);
        token.claimFromEscrow(tokens);

        tokens[0] = 2;
        vm.prank(owner1);
        token.claimFromEscrow(tokens);

        // mining one block so proposer prior votes getter sees their tokens.
        vm.roll(block.number + 1);

        propose();
    }

    function test_propose_givenTokensToClaimAndDelayedGovernanceExpires_works() public {
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.prank(proposer);
        token.claimFromEscrow(tokens);
        // mining one block so proposer prior votes getter sees their tokens.
        vm.roll(block.number + 1);

        vm.warp(dao.delayedGovernanceExpirationTimestamp());

        propose();
    }

    function test_quit_givenPartialClaim_reverts() public {
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.startPrank(proposer);
        token.claimFromEscrow(tokens);

        token.setApprovalForAll(address(dao), true);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        dao.quit(tokens);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        dao.quit(tokens, new address[](0));
    }

    function test_quit_givenFullClaim_works() public {
        vm.deal(timelock, 10 ether);
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 2;
        vm.prank(owner1);
        token.claimFromEscrow(tokens);

        vm.startPrank(proposer);
        tokens[0] = 1;
        token.claimFromEscrow(tokens);

        token.setApprovalForAll(address(dao), true);

        dao.quit(tokens);
        assertEq(proposer.balance, 5 ether);
    }

    function test_quit_givenTokensToClaimAndDelayedGovernanceExpires_worksAndKeepsProRataForUnclaimedTokens() public {
        vm.deal(timelock, 10 ether);
        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 1;
        vm.startPrank(proposer);
        token.claimFromEscrow(tokens);

        vm.warp(dao.delayedGovernanceExpirationTimestamp());

        token.setApprovalForAll(address(dao), true);

        dao.quit(tokens);
        assertEq(proposer.balance, 5 ether);

        changePrank(owner1);
        tokens[0] = 2;
        token.claimFromEscrow(tokens);

        // showing that the late claimer's quit pro rata is preserved
        token.setApprovalForAll(address(dao), true);
        dao.quit(tokens);
        assertEq(owner1.balance, 5 ether);
    }
}

contract NounsDAOLogicV1Fork_Quit_Test is NounsDAOLogicV1ForkBase {
    address quitter = makeAddr('quitter');
    uint256[] quitterTokens;
    ERC20Mock token1;
    ERC20Mock token2;
    uint256 constant ETH_BALANCE = 120 ether;
    uint256 constant TOKEN1_BALANCE = 12345;
    uint256 constant TOKEN2_BALANCE = 8765;
    address[] tokens;
    uint256 ethPerNoun;

    function setUp() public override {
        super.setUp();

        vm.warp(token.forkingPeriodEndTimestamp());

        // Set up ERC20s owned by the DAO
        mintERC20s();
        vm.prank(address(dao.timelock()));
        dao._setErc20TokensToIncludeInQuit(tokens);

        // Send ETH to the DAO
        vm.deal(address(dao.timelock()), ETH_BALANCE);

        mintNounsToQuitter();

        ethPerNoun = ETH_BALANCE / token.totalSupply();

        vm.prank(quitter);
        token.setApprovalForAll(address(dao), true);
    }

    function test_quit_tokensAreSentToTreasury() public {
        vm.prank(quitter);
        dao.quit(quitterTokens);

        assertEq(token.balanceOf(timelock), 2);
    }

    function test_quit_sendsProRataETHAndERC20s() public {
        assertEq(quitter.balance, 0);
        assertEq(token1.balanceOf(quitter), 0);
        assertEq(token2.balanceOf(quitter), 0);

        vm.prank(quitter);
        dao.quit(quitterTokens);

        assertEq(quitter.balance, 24 ether);
        assertEq(token1.balanceOf(quitter), (TOKEN1_BALANCE * 2) / 10);
        assertEq(token2.balanceOf(quitter), (TOKEN2_BALANCE * 2) / 10);
    }

    function test_quit_allowsChoosingErc20TokensToInclude() public {
        vm.prank(quitter);
        address[] memory tokensToInclude = new address[](1);
        tokensToInclude[0] = address(token2);
        dao.quit(quitterTokens, tokensToInclude);

        assertEq(quitter.balance, 24 ether);
        assertEq(token1.balanceOf(quitter), 0);
        assertEq(token2.balanceOf(quitter), (TOKEN2_BALANCE * 2) / 10);
    }

    function test_quit_allowsExcludingAllErc20Tokens() public {
        vm.prank(quitter);
        address[] memory tokensToInclude = new address[](0);
        dao.quit(quitterTokens, tokensToInclude);

        assertEq(quitter.balance, 24 ether);
        assertEq(token1.balanceOf(quitter), 0);
        assertEq(token2.balanceOf(quitter), 0);
    }

    function test_quit_withErc20TokensToIncludes_revertsIfNotASubset() public {
        vm.prank(quitter);
        address[] memory tokensToInclude = new address[](2);
        tokensToInclude[0] = address(token2);
        tokensToInclude[1] = makeAddr('random addr');
        vm.expectRevert(NounsDAOLogicV1Fork.TokensMustBeASubsetOfWhitelistedTokens.selector);
        dao.quit(quitterTokens, tokensToInclude);
    }

    function test_quit_reentranceReverts() public {
        MaliciousForkDAOQuitter reentrancyQuitter = new MaliciousForkDAOQuitter(dao);
        transferQuitterTokens(address(reentrancyQuitter));

        vm.startPrank(address(reentrancyQuitter));
        token.setApprovalForAll(address(dao), true);

        vm.expectRevert('Address: unable to send value, recipient may have reverted');
        dao.quit(quitterTokens);
    }

    function test_quit_givenRecipientRejectsETH_reverts() public {
        ETHBlocker blocker = new ETHBlocker();
        transferQuitterTokens(address(blocker));

        vm.startPrank(address(blocker));
        token.setApprovalForAll(address(dao), true);

        vm.expectRevert('Address: unable to send value, recipient may have reverted');
        dao.quit(quitterTokens);
    }

    function test_quit_givenERC20SendFailure_reverts() public {
        token1.setFailNextTransfer(true);

        vm.prank(quitter);
        vm.expectRevert('SafeERC20: ERC20 operation did not succeed');
        dao.quit(quitterTokens);
    }

    function test_quit_givenZeroERC20Balance_doesNotCallTransfer() public {
        address treasury = address(dao.timelock());
        ERC20Mock zeroBalanceToken = ERC20Mock(tokens[0]);

        // zero out treasury balance of one token
        vm.startPrank(treasury);
        zeroBalanceToken.transfer(address(1), zeroBalanceToken.balanceOf(treasury));
        assertEq(zeroBalanceToken.balanceOf(treasury), 0);
        vm.stopPrank();

        ERC20Mock(tokens[0]).setWasTransferCalled(false);
        ERC20Mock(tokens[1]).setWasTransferCalled(false);

        vm.prank(quitter);
        dao.quit(quitterTokens);

        assertFalse(ERC20Mock(tokens[0]).wasTransferCalled());
        assertTrue(ERC20Mock(tokens[1]).wasTransferCalled());
    }

    function transferQuitterTokens(address to) internal {
        uint256 quitterBalance = token.balanceOf(quitter);
        uint256[] memory tokenIds = new uint256[](quitterBalance);
        for (uint256 i = 0; i < quitterBalance; ++i) {
            tokenIds[i] = token.tokenOfOwnerByIndex(quitter, i);
        }
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            vm.prank(quitter);
            token.transferFrom(quitter, to, tokenIds[i]);
        }
        vm.roll(block.number + 1);
    }

    function mintERC20s() internal {
        token1 = new ERC20Mock();
        token1.mint(address(dao.timelock()), TOKEN1_BALANCE);
        token2 = new ERC20Mock();
        token2.mint(address(dao.timelock()), TOKEN2_BALANCE);
        tokens.push(address(token1));
        tokens.push(address(token2));
    }

    function mintNounsToQuitter() internal {
        address minter = token.minter();
        vm.startPrank(minter);
        while (token.totalSupply() < 10) {
            uint256 tokenId = token.mint();
            address to = proposer;
            if (tokenId > 7) {
                to = quitter;
                quitterTokens.push(tokenId);
            }
            token.transferFrom(token.minter(), to, tokenId);
        }
        vm.stopPrank();

        vm.roll(block.number + 1);

        assertEq(token.totalSupply(), 10);
        assertEq(token.balanceOf(quitter), 2);
    }
}

contract NounsDAOLogicV1Fork_AdjustedTotalSupply_Test is ForkWithEscrow {
    uint256 constant TOTAL_MINTED = 20;
    uint256 constant MIN_ID_FOR_QUITTER = TOTAL_MINTED - ((2 * TOTAL_MINTED) / 10); // 20% of tokens go to quitter

    address quitter = makeAddr('quitter');
    uint256[] quitterTokens;

    function setUp() public override {
        super.setUp();

        vm.warp(token.forkingPeriodEndTimestamp());

        address minter = token.minter();
        vm.startPrank(minter);
        while (token.totalSupply() < TOTAL_MINTED) {
            uint256 tokenId = token.mint();
            address to = proposer;
            if (tokenId >= MIN_ID_FOR_QUITTER) {
                to = quitter;
                quitterTokens.push(tokenId);
            }
            token.transferFrom(token.minter(), to, tokenId);
        }
        vm.stopPrank();

        vm.roll(block.number + 1);

        vm.prank(quitter);
        token.setApprovalForAll(address(dao), true);

        vm.startPrank(address(dao.timelock()));
        dao._setProposalThresholdBPS(1000);
        dao._setQuorumVotesBPS(2000);
        vm.stopPrank();

        vm.warp(dao.delayedGovernanceExpirationTimestamp());
    }

    function test_proposalThreshold_usesAdjustedTotalSupply() public {
        assertEq(dao.proposalThreshold(), 2);

        vm.prank(quitter);
        dao.quit(quitterTokens);

        assertEq(dao.proposalThreshold(), 1);
    }

    function test_quorumVotes_usesAdjustedTotalSupply() public {
        assertEq(dao.quorumVotes(), 4);

        vm.prank(quitter);
        dao.quit(quitterTokens);

        assertEq(dao.quorumVotes(), 3);
    }

    function test_propose_setsThresholdAndQuorumUsingAdjustedTotalSupply() public {
        vm.prank(quitter);
        dao.quit(quitterTokens);
        uint256 proposalId = propose();

        assertEq(dao.proposals(proposalId).proposalThreshold, 1);
        assertEq(dao.proposals(proposalId).quorumVotes, 3);
    }

    function test_adjustedTotalSupply_includesTokensNotYetClaimed() public {
        uint256 expectedSupply = TOTAL_MINTED + token.remainingTokensToClaim();
        assertEq(dao.adjustedTotalSupply(), expectedSupply);

        uint256[] memory tokens = new uint256[](1);
        tokens[0] = 2;
        vm.prank(owner1);
        token.claimFromEscrow(tokens);

        assertEq(dao.adjustedTotalSupply(), expectedSupply);
    }
}

contract ETHBlocker {}

contract MaliciousCallbackForker is IERC20Receiver, CommonBase {
    NounsTokenFork token;
    address originalDAO;
    address forkDAO;
    uint256[] tokenIdsToReenterWith;
    uint256 ethPerNoun;
    bool reentered;

    constructor(
        NounsTokenFork token_,
        address originalDAO_,
        address forkDAO_,
        uint256[] memory tokenIdsToReenterWith_,
        uint256 ethPerNoun_
    ) {
        token = token_;
        originalDAO = originalDAO_;
        forkDAO = forkDAO_;
        tokenIdsToReenterWith = tokenIdsToReenterWith_;
        ethPerNoun = ethPerNoun_;
    }

    function onERC20Received(address, uint256) external {
        if (!reentered) {
            reentered = true;

            // Simulating joinFork on original DAO
            address treasury = address(NounsDAOLogicV1Fork(forkDAO).timelock());
            vm.deal(treasury, treasury.balance + ethPerNoun);
            vm.prank(originalDAO);
            token.claimDuringForkPeriod(address(this), tokenIdsToReenterWith);
        }
    }

    receive() external payable {}
}
