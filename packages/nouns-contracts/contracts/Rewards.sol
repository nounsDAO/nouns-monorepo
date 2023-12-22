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
import { console } from 'forge-std/console.sol';

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
    mapping(uint256 proposalId => mapping(uint32 clientId => bool paid)) votingPaid;
    mapping(uint256 proposalId => bool paid) votingWithBonusPaid;
    uint256 public annualProposalReward = 100 ether; // TODO: read auction history
    uint32 public nextProposalIdToReward = 400; // TODO: set from constructor
    uint256 public nextProposalRewardTimestamp = block.timestamp;
    uint256 public minimumRewardPeriod = 2 weeks;
    uint256 public numProposalsEnoughForReward = 30; // TODO: set based on gas usage
    uint16 public proposalRewardBPS = 100; // TODO make configurable
    uint16 public votingRewardBPS = 50; // TODO make configurable
    mapping(uint32 clientId => uint256 balance) public clientBalances;

    struct ClientData {
        address payoutWallet;
    }

    mapping(uint32 clientId => ClientData data) clients;

    constructor(address nounsDAO_, address auctionHouse_, uint32 nextProposalIdToReward_) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseRewards(auctionHouse_);
        nextProposalIdToReward = nextProposalIdToReward_;
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
    }

    /**
     *
     * @param expectedNumEligibleProposals should match the number of eligible proposals. TODO: a view function for this
     */
    function bountyRewardForProposals(
        uint32 lastTimestamp,
        uint256 expectedNumEligibleProposals,
        uint256 expectedNumEligibileVotes,
        uint256 firstNounId,
        uint256 lastNounId,
        uint32[] calldata votingClientIds
    ) public {
        uint256 gas = gasleft();
        uint256 gas0 = gasleft();
        // TODO should we support a case where minimumRewardPeriodInBlocks is e.g. 1 week, and a week has passed
        //  but the last proposal was before a week has passed?

        require(expectedNumEligibleProposals > 0, 'at least one eligible proposal');
        require(lastTimestamp < block.timestamp, 'last block must be in the past');

        if (expectedNumEligibleProposals < numProposalsEnoughForReward) {
            require(lastTimestamp > nextProposalRewardTimestamp + minimumRewardPeriod, 'not enough time passed');
        } else {
            require(lastTimestamp > nextProposalRewardTimestamp);
        }

        Temp memory t;

        console.log('>>>>>>>> gas used', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        uint256 auctionRevenue = getAuctionRevenueForPeriod({
            startTimestamp: nextProposalRewardTimestamp,
            endTimestamp: lastTimestamp,
            firstNounId: firstNounId,
            lastNounId: lastNounId
        });

        console.log('>>>>>>>> gas used for getAuctionRevenueForPeriod', gas - gasleft(), lastNounId - firstNounId);
        gas = gasleft();

        t.proposalRewardForPeriod = (auctionRevenue * proposalRewardBPS) / 10000;
        t.votingRewardForPeriod = (auctionRevenue * votingRewardBPS) / 10000;

        console.log('>>>>>>>> gas used for periods', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        nextProposalRewardTimestamp = lastTimestamp + 1;

        console.log('>>>>>>>> gas used for setting nextProposalRewardTimestamp', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        t.rewardPerProposal = t.proposalRewardForPeriod / expectedNumEligibleProposals;
        t.rewardPerVote = t.votingRewardForPeriod / expectedNumEligibileVotes;

        NounsDAOStorageV3.ProposalForRewards memory proposal;

        console.log('>>>>>>>> gas used', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        uint256 maxProposalId = nounsDAO.proposalCount();

        console.log('>>>>>>>> gas used for proposalCount()', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        uint32 pid = nextProposalIdToReward;

        console.log('>>>>>>>> gas used', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();

        // TODO: remove this, just for gas measuring purposes
        for (uint256 i; i < votingClientIds.length; ++i) {
            clientBalances[votingClientIds[i]] += 1;
        }
        console.log('>>>>>>>> gas used setting storage', gas - gasleft(), gas0 - gasleft());
        gas = gasleft();
        // END TODO

        for (; pid <= maxProposalId; pid++) {
            proposal = nounsDAO.proposalDataForRewards(pid);
            console.log('>>>>>>>> gas used reading proposalsV3()', gas - gasleft(), pid, gas0 - gasleft());
            gas = gasleft();

            if (proposal.creationTimestamp > lastTimestamp) break;

            // make sure proposal finished voting
            uint endBlock = max(proposal.endBlock, proposal.objectionPeriodEndBlock);
            require(block.number > endBlock, 'all proposals must be done with voting');

            // skip non eligible proposals TODO: parameterize quorum
            // console.log('>>>>> proposal.pseudo quorum', proposal.totalSupply, (proposal.totalSupply * 1000) / 10000);
            if (proposal.forVotes < (proposal.totalSupply * 1000) / 10000) continue;

            // proposal is eligible for reward
            ++t.actualNumEligibleProposals;

            uint32 clientId = proposal.clientId;
            if (clientId != 0) {
                clientBalances[clientId] += t.rewardPerProposal;
            }

            // console.log('>>>>>>>> gas used up to votes', gas - gasleft());
            // gas = gasleft();
            uint256 votesInProposal;

            NounsDAOStorageV3.ClientVoteData[] memory voteData = nounsDAO.proposalVoteClientsData(pid, votingClientIds);
            // console.log('>>>>>>>> gas used for reading vote data', gas - gasleft());
            // gas = gasleft();

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
                votesInProposal == proposal.forVotes + proposal.againstVotes + proposal.abstainVotes,
                'not all votes accounted'
            );
            t.actualNumEligibleVotes += votesInProposal;

            console.log('>>>>>>>> gas used for votes', gas - gasleft(), gas0 - gasleft());
            gas = gasleft();
        }

        // console.log('>>>>>>>> gas used', gas - gasleft());
        // gas = gasleft();

        nextProposalIdToReward = pid;

        console.log('>>>>>>>>>. t.actualNumEligibleProposals', t.actualNumEligibleProposals);
        require(t.actualNumEligibleProposals == expectedNumEligibleProposals, 'wrong expectedNumEligibleProposals');
        require(t.actualNumEligibleVotes == expectedNumEligibileVotes, 'wrong expectedNumEligibileVotes');

        console.log('>>>>>>>> gas used', gas - gasleft(), gas0 - gasleft());
    }

    function getAuctionRevenueForPeriod(
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 firstNounId,
        uint256 lastNounId
    ) internal view returns (uint256) {
        INounsAuctionHouseRewards.Settlement[] memory s = auctionHouse.getSettlements(firstNounId, lastNounId, true);
        require(s[0].blockTimestamp <= startTimestamp, 'first auction must be before start ts');
        require(s[1].blockTimestamp >= startTimestamp, 'second auction must be after start ts');
        require(s[s.length - 2].blockTimestamp <= endTimestamp, 'second to last auction must be before end ts');
        require(s[s.length - 1].blockTimestamp >= endTimestamp, 'last auction must be after end ts');

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
