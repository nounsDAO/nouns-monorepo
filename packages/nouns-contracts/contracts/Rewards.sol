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
import { INounsAuctionHouseV2 } from './interfaces/INounsAuctionHouseV2.sol';
import { NounsDAOStorageV3 } from './governance/NounsDAOInterfaces.sol';

contract Rewards {
    uint256 internal constant PROPOSAL_STATE_EXECUTED = 7;
    uint256 public constant REWARD_FOR_PROPOSAL_CREATION = 0.5 ether;
    uint256 public constant REWARD_FOR_PROPOSAL_BY_SIGS_CREATION = 0.6 ether;
    uint256 public constant REWARD_FOR_AUCTION_BIDDING = 0.4 ether;
    uint256 public constant REWARD_FOR_PROPOSAL_VOTING = 0.3 ether;
    uint256 public constant REWARD_FOR_VOTING_FIRST_PLACE = 0.1 ether;

    INounsDAOLogicV3 public immutable nounsDAO;
    INounsAuctionHouseV2 public immutable auctionHouse;

    mapping(uint256 proposalId => bool paid) proposalsPaid;
    mapping(uint256 nounId => bool paid) auctionsPaid;
    mapping(uint256 proposalId => mapping(uint32 clientId => bool paid)) votingPaid;
    mapping(uint256 proposalId => bool paid) votingWithBonusPaid;
    uint256 public annualProposalReward = 100 ether; // TODO: read auction history
    uint32 public nextProposalIdToReward = 400; // TODO: set from constructor
    uint256 public nextProposalRewardTimestamp = block.timestamp;
    uint256 public minimumRewardPeriod = 2 weeks;
    uint256 public numProposalsEnoughForReward = 30; // TODO: set based on gas usage
    uint16 public proposalRewardBPS = 100; // TODO make configurable
    uint16 public votingRewardBPS = 50; // TODO make configurable
    uint256 public lastProcessedAuctionId;
    uint32 public auctionRewardBps = 100; // TODO make configurable
    mapping(uint32 clientId => uint256 balance) public clientBalances;

    struct ClientData {
        address payoutWallet;
    }

    mapping(uint32 clientId => ClientData data) clients;

    constructor(
        address nounsDAO_,
        address auctionHouse_,
        uint32 nextProposalIdToReward_,
        uint256 lastProcessedAuctionId_
    ) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
        nextProposalIdToReward = nextProposalIdToReward_;
        lastProcessedAuctionId = lastProcessedAuctionId_;
    }

    // TODO: only admin?
    function setNextProposalRewardTimestamp(uint256 ts) public {
        nextProposalRewardTimestamp = ts;
    }

    struct Temp {
        uint256 proposalRewardForPeriod;
        uint256 votingRewardForPeriod;
        uint256 actualNumEligibleProposals;
        uint256 actualNumEligibleVotes;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
        NounsDAOStorageV3.ProposalForRewards proposal;
    }

    function updateRewardsForAuctions(uint256 lastNounId) public {
        uint256 currentlyAuctionedNounId = auctionHouse.auction().nounId;
        require(lastNounId < currentlyAuctionedNounId, 'lastNounId must be settled');

        uint256 lastProcessedAuctionId_ = lastProcessedAuctionId;
        require(lastNounId > lastProcessedAuctionId_, 'lastNounId must be higher');
        lastProcessedAuctionId = lastNounId;

        INounsAuctionHouseV2.Settlement memory settlement;
        for (uint256 nounId = lastProcessedAuctionId_ + 1; nounId <= lastNounId; nounId++) {
            // TODO maybe can be optimized to one call with large range
            settlement = auctionHouse.getSettlements(nounId, nounId + 1, false)[0];
            if (settlement.clientId > 0) {
                clientBalances[settlement.clientId] += (settlement.amount * auctionRewardBps) / 10_000;
            }
        }
    }

    /**
     *
     * @param expectedNumEligibleProposals should match the number of eligible proposals. TODO: a view function for this
     */
    function bountyRewardForProposals(
        uint32 lastProposalId,
        uint256 expectedNumEligibleProposals,
        uint256 expectedNumEligibileVotes,
        uint256 firstNounId,
        uint256 lastNounId,
        uint32[] calldata votingClientIds
    ) public {
        require(expectedNumEligibleProposals > 0, 'at least one eligible proposal');

        uint256 maxProposalId = nounsDAO.proposalCount();
        require(lastProposalId <= maxProposalId, 'bad lastProposalId');
        require(lastProposalId >= nextProposalIdToReward, 'bad lastProposalId');

        Temp memory t;

        t.proposal = nounsDAO.proposalDataForRewards(lastProposalId);

        if (expectedNumEligibleProposals < numProposalsEnoughForReward) {
            require(
                t.proposal.creationTimestamp > nextProposalRewardTimestamp + minimumRewardPeriod,
                'not enough time passed'
            );
        }

        uint256 auctionRevenue = getAuctionRevenueForPeriod({
            startTimestamp: nextProposalRewardTimestamp,
            endTimestamp: t.proposal.creationTimestamp,
            firstNounId: firstNounId,
            lastNounId: lastNounId
        });

        t.proposalRewardForPeriod = (auctionRevenue * proposalRewardBPS) / 10000;
        t.votingRewardForPeriod = (auctionRevenue * votingRewardBPS) / 10000;

        nextProposalRewardTimestamp = t.proposal.creationTimestamp + 1;

        t.rewardPerProposal = t.proposalRewardForPeriod / expectedNumEligibleProposals;
        t.rewardPerVote = t.votingRewardForPeriod / expectedNumEligibileVotes;

        uint32 lowestProposalIdToReward = nextProposalIdToReward;
        nextProposalIdToReward = lastProposalId + 1;

        // TODO: remove this, just for gas measuring purposes
        for (uint256 i; i < votingClientIds.length; ++i) {
            clientBalances[votingClientIds[i]] += 1;
        }
        // END TODO

        for (uint32 pid = lastProposalId; pid >= lowestProposalIdToReward; pid--) {
            if (pid != lastProposalId) {
                t.proposal = nounsDAO.proposalDataForRewards(pid);
            }

            // make sure proposal finished voting
            uint endBlock = max(t.proposal.endBlock, t.proposal.objectionPeriodEndBlock);
            require(block.number > endBlock, 'all proposals must be done with voting');

            // skip non eligible proposals TODO: parameterize quorum
            if (t.proposal.forVotes < (t.proposal.totalSupply * 1000) / 10000) continue;

            // proposal is eligible for reward
            ++t.actualNumEligibleProposals;

            uint32 clientId = t.proposal.clientId;
            if (clientId != 0) {
                clientBalances[clientId] += t.rewardPerProposal;
            }

            uint256 votesInProposal;

            NounsDAOStorageV3.ClientVoteData[] memory voteData = nounsDAO.proposalVoteClientsData(pid, votingClientIds);

            uint256 votes;
            for (uint256 i; i < votingClientIds.length; ++i) {
                clientId = votingClientIds[i];
                votes = voteData[i].votes;
                if (clientId != 0) {
                    clientBalances[clientId] += votes * t.rewardPerVote;
                }
                votesInProposal += votes;
            }
            require(
                votesInProposal == t.proposal.forVotes + t.proposal.againstVotes + t.proposal.abstainVotes,
                'not all votes accounted'
            );
            t.actualNumEligibleVotes += votesInProposal;
        }

        require(t.actualNumEligibleProposals == expectedNumEligibleProposals, 'wrong expectedNumEligibleProposals');
        require(t.actualNumEligibleVotes == expectedNumEligibileVotes, 'wrong expectedNumEligibileVotes');
    }

    function getAuctionRevenueForPeriod(
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 firstNounId,
        uint256 lastNounId
    ) internal view returns (uint256) {
        INounsAuctionHouseV2.Settlement[] memory s = auctionHouse.getSettlements(firstNounId, lastNounId, true);
        require(s[0].blockTimestamp <= startTimestamp, 'first auction must be before start ts');
        require(s[1].blockTimestamp >= startTimestamp, 'second auction must be after start ts');
        require(s[s.length - 2].blockTimestamp <= endTimestamp, 'second to last auction must be before end ts');
        require(s[s.length - 1].blockTimestamp >= endTimestamp, 'last auction must be after end ts');

        return sumAuctions(s);
    }

    function sumAuctions(INounsAuctionHouseV2.Settlement[] memory s) internal pure returns (uint256 sum) {
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

        uint32 clientId = nounsDAO.proposalClientId(proposalId);

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

        uint32 clientId = auctionHouse.biddingClient(nounId);
        payClient(clientId, REWARD_FOR_AUCTION_BIDDING);
    }

    function rewardForVoting(uint256 proposalId, uint32 clientId) public {
        NounsDAOStorageV3.ProposalCondensed memory proposal = nounsDAO.proposalsV3(proposalId);
        requireProposalEligibleForRewards(proposal);

        require(!votingPaid[proposalId][clientId], 'Already paid');
        votingPaid[proposalId][clientId] = true;

        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        NounsDAOStorageV3.ClientVoteData memory voteData = nounsDAO.proposalVoteClientData(proposalId, clientId);

        payClient(clientId, (REWARD_FOR_PROPOSAL_VOTING * voteData.votes) / totalVotes);
    }

    function rewardForVotingWithBonus(uint256 proposalId, uint32[] calldata clientIds) public {
        require(uint256(nounsDAO.state(proposalId)) == PROPOSAL_STATE_EXECUTED, 'Proposal must have executed');

        require(!votingWithBonusPaid[proposalId], 'Already paid');
        votingWithBonusPaid[proposalId] = true;

        uint32 clientId = clientIds[0];
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

    function payClient(uint32 clientId, uint256 amount) internal {
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
