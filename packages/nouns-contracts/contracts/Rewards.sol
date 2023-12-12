// SPDX-License-Identifier: GPL-3.0

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.19;

import { INounsDAOLogicV3 } from './interfaces/INounsDAOLogicV3.sol';
import { INounsAuctionHouseRewards } from './interfaces/INounsAuctionHouseRewards.sol';
import { NounsDAOStorageV3 } from './governance/NounsDAOInterfaces.sol';

contract Rewards {
    uint256 internal constant PROPOSAL_STATE_EXECUTED = 7;
    uint256 public constant REWARD_FOR_PROPOSAL_CREATION = 0.5 ether;
    uint256 public constant REWARD_FOR_PROPOSAL_BY_SIGS_CREATION = 0.6 ether;
    uint256 public constant REWARD_FOR_AUCTION_BIDDING = 0.4 ether;
    uint256 public constant REWARD_FOR_PROPOSAL_VOTING = 0.3 ether;
    uint256 public constant REWARD_FOR_VOTING_FIRST_PLACE = 0.1 ether;
    uint256 public constant BLOCKS_PER_YEAR = 365 days / 12;

    INounsDAOLogicV3 public immutable nounsDAO;
    INounsAuctionHouseRewards public immutable auctionHouse;

    mapping(uint256 proposalId => bool paid) proposalsPaid;
    mapping(uint256 nounId => bool paid) auctionsPaid;
    mapping(uint256 proposalId => mapping(uint16 clientId => bool paid)) votingPaid;
    mapping(uint256 proposalId => bool paid) votingWithBonusPaid;
    uint256 public annualProposalReward = 100 ether; // TODO: read auction history
    uint32 public nextProposalIdToReward = 400; // TODO: set from constructor
    uint256 public nextProposalRewardStartBlock = block.number;
    uint256 public minimumRewardPeriodInBlocks = 2 weeks / 12;
    uint256 public numProposalsEnoughForReward = 30; // TODO: set based on gas usage
    uint16 public proposalRewardBPS = 100; // TODO make configurable
    uint16 public votingRewardBPS = 50; // TODO make configurable
    mapping(uint32 clientId => uint256 balance) clientBalances;

    struct ClientData {
        address payoutWallet;
    }

    mapping(uint32 clientId => ClientData data) clients;

    constructor(address nounsDAO_, address auctionHouse_) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseRewards(auctionHouse_);
    }

    struct Temp {
        uint256 proposalRewardForPeriod;
        uint256 votingRewardForPeriod;
        uint256 actualNumEligibleProposals;
        uint256 actualNumEligibleVotes;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
    }

    /**
     *
     * @param lastProposalId the last proposal to consider for reward. all proposals up to this proposal must be after the voting period
     * @param lastProposalBlock the block.number of the voting start of `lastProposalId`
     * @param expectedNumEligibleProposals should match the number of eligible proposals. TODO: a view function for this
     */
    function bountyRewardForProposals(
        uint32 lastProposalId,
        uint256 lastProposalBlock,
        uint256 expectedNumEligibleProposals,
        uint256 expectedNumEligibileVotes,
        uint256 firstNounId,
        uint256 lastNounId,
        uint32[] calldata votingClientIds
    ) public {
        require(expectedNumEligibleProposals > 0, 'at least one eligible proposal');

        if (expectedNumEligibleProposals < numProposalsEnoughForReward) {
            require(
                lastProposalBlock > nextProposalRewardStartBlock + minimumRewardPeriodInBlocks,
                'not enough time passed'
            );
        }

        Temp memory t;

        uint256 auctionRevenue = getAuctionRevenueForPeriod({
            startBlock: nextProposalRewardStartBlock,
            endBlock: lastProposalBlock,
            firstNounId: firstNounId,
            lastNounId: lastNounId
        });
        t.proposalRewardForPeriod = (auctionRevenue * proposalRewardBPS) / 10000;
        t.votingRewardForPeriod = (auctionRevenue * votingRewardBPS) / 10000;

        nextProposalRewardStartBlock = lastProposalBlock + 1;

        t.rewardPerProposal = t.proposalRewardForPeriod / expectedNumEligibleProposals;
        t.rewardPerVote = t.votingRewardForPeriod / expectedNumEligibileVotes;

        NounsDAOStorageV3.ProposalCondensed memory proposal;
        uint32 pid;
        for (pid = nextProposalIdToReward; pid <= lastProposalId; pid++) {
            proposal = nounsDAO.proposalsV3(pid);

            // make sure proposal finished voting
            uint endBlock = max(proposal.endBlock, proposal.objectionPeriodEndBlock);
            require(endBlock > block.number, 'all proposals must be done with voting');

            // skip non eligible proposals
            if (proposal.forVotes < proposal.quorumVotes) continue;

            // proposal is eligible for reward
            ++t.actualNumEligibleProposals;

            uint32 clientId = nounsDAO.proposalClientId(pid);
            if (clientId != 0) {
                clientBalances[clientId] += t.rewardPerProposal;
            }

            uint256 votesInProposal;
            for (uint256 i; i < votingClientIds.length; ++i) {
                NounsDAOStorageV3.ClientVoteData memory voteData = nounsDAO.proposalVoteClientData(
                    pid,
                    votingClientIds[i]
                );
                clientBalances[clientId] += voteData.votes * t.rewardPerVote;
                votesInProposal += voteData.votes;
            }
            require(votesInProposal == proposal.forVotes + proposal.againstVotes + proposal.abstainVotes);
            t.actualNumEligibleVotes += votesInProposal;
        }

        nextProposalIdToReward = pid + 1;

        require(proposal.startBlock == lastProposalBlock);
        require(t.actualNumEligibleProposals == expectedNumEligibleProposals);
        require(t.actualNumEligibleVotes == expectedNumEligibileVotes);
    }

    function getAuctionRevenueForPeriod(
        uint256 startBlock,
        uint256 endBlock,
        uint256 firstNounId,
        uint256 lastNounId
    ) internal returns (uint256) {
        uint256 startTimestamp = block.timestamp - (block.number - startBlock) * 12;
        uint256 endTimestamp = block.timestamp - (block.number - endBlock) * 12;

        INounsAuctionHouseRewards.Settlement[] memory s = auctionHouse.getSettlements(firstNounId, lastNounId, true);
        require(s[0].blockTimestamp <= startTimestamp);
        require(s[1].blockTimestamp >= startTimestamp);
        require(s[s.length - 2].blockTimestamp <= endTimestamp);
        require(s[s.length - 1].blockTimestamp >= endTimestamp);

        return sumAuctions(s);
    }

    function sumAuctions(INounsAuctionHouseRewards.Settlement[] memory s) internal pure returns (uint256 sum) {
        for (uint256 i = 0; i < s.length; ++i) {
            if (s[i].amount == 0) continue; // skip auctions with no bids
            sum += s[i].amount;
        }
    }

    function rewardForProposalCreation(uint256 proposalId) public {
        NounsDAOStorageV3.ProposalCondensed memory proposal = nounsDAO.proposalsV3(proposalId);
        requireProposalEligibleForRewards(proposal);

        require(!proposalsPaid[proposalId], 'Already paid');
        proposalsPaid[proposalId] = true;

        uint16 clientId = nounsDAO.proposalClientId(proposalId);

        if (proposal.signers.length > 0) {
            payClient(clientId, REWARD_FOR_PROPOSAL_BY_SIGS_CREATION);
        } else {
            payClient(clientId, REWARD_FOR_PROPOSAL_CREATION);
        }
    }

    function rewardForAuctionBidding(uint256 nounId) public {
        require(auctionHouse.auction().nounId > nounId);
        require(!auctionsPaid[nounId], 'Already paid');
        auctionsPaid[nounId] = true;

        uint16 clientId = auctionHouse.biddingClient(nounId);
        payClient(clientId, REWARD_FOR_AUCTION_BIDDING);
    }

    function rewardForVoting(uint256 proposalId, uint16 clientId) public {
        NounsDAOStorageV3.ProposalCondensed memory proposal = nounsDAO.proposalsV3(proposalId);
        requireProposalEligibleForRewards(proposal);

        require(!votingPaid[proposalId][clientId], 'Already paid');
        votingPaid[proposalId][clientId] = true;

        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        NounsDAOStorageV3.ClientVoteData memory voteData = nounsDAO.proposalVoteClientData(proposalId, clientId);

        payClient(clientId, (REWARD_FOR_PROPOSAL_VOTING * voteData.votes) / totalVotes);
    }

    function rewardForVotingWithBonus(uint256 proposalId, uint16[] calldata clientIds) public {
        require(uint256(nounsDAO.state(proposalId)) == PROPOSAL_STATE_EXECUTED, 'Proposal must have executed');

        require(!votingWithBonusPaid[proposalId], 'Already paid');
        votingWithBonusPaid[proposalId] = true;

        uint16 clientId = clientIds[0];
        NounsDAOStorageV3.ClientVoteData memory voteData = nounsDAO.proposalVoteClientData(proposalId, clientId);
        NounsDAOStorageV3.ClientVoteData memory nextVoteData;

        uint256 totalVotes = voteData.votes;

        // verify clients ordered by number of votes, descending
        for (uint i = 1; i < clientIds.length; i++) {
            nextVoteData = nounsDAO.proposalVoteClientData(proposalId, clientIds[i]);
            require(nextVoteData.votes <= voteData.votes, 'Wrong order');

            totalVotes += nextVoteData.votes;

            voteData = nextVoteData;
        }

        // verify all votes are accounted for
        NounsDAOStorageV3.ProposalCondensed memory proposal = nounsDAO.proposalsV3(proposalId);
        uint256 proposalTotalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        require(totalVotes == proposalTotalVotes, 'Not all clients');

        // TODO: this doesn't handle cases where there's a tie
        payClient(clientIds[0], REWARD_FOR_VOTING_FIRST_PLACE);
    }

    function registerClient(uint32 clientId, address payoutWallet) public {
        require(clients[clientId].payoutWallet == address(0));

        clients[clientId].payoutWallet = payoutWallet;
    }

    function payClient(uint16 clientId, uint256 amount) internal {
        address to = clients[clientId].payoutWallet;
        (bool sent, ) = to.call{ value: amount }('');
        require(sent, 'Failed sending ether');
    }

    function requireProposalEligibleForRewards(NounsDAOStorageV3.ProposalCondensed memory proposal) internal view {
        require(proposal.forVotes >= proposal.quorumVotes, 'must reach quorum');

        // voting has ended
        require(block.number > proposal.endBlock, 'voting must end');
        require(block.number > proposal.updatePeriodEndBlock, 'voting must end');
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}
