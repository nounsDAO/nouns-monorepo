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
import { NounsDAOV3Types } from './governance/NounsDAOInterfaces.sol';
import { ERC721 } from '@openzeppelin/contracts-v5/token/ERC721/ERC721.sol';
import { IERC20 } from '@openzeppelin/contracts-v5/token/ERC20/IERC20.sol';

contract Rewards is ERC721('NounsClientIncentives', 'NounsClientIncentives') {
    INounsDAOLogicV3 public immutable nounsDAO;
    INounsAuctionHouseV2 public immutable auctionHouse;

    uint32 public nextTokenId = 1;

    uint256 public lastProcessedAuctionId;
    uint32 public nextProposalIdToReward = 400; // TODO: set from constructor
    uint256 public nextProposalRewardTimestamp;
    uint256 public minimumRewardPeriod;
    uint8 public numProposalsEnoughForReward; // TODO: set based on gas usage

    RewardParams public params; // TODO make configurable

    IERC20 public ethToken; // TODO make configurable

    mapping(uint32 clientId => uint256 balance) public clientBalances;

    struct ClientData {
        address payoutWallet;
    }

    struct RewardParams {
        uint32 minimumRewardPeriod;
        uint8 numProposalsEnoughForReward;
        uint16 proposalRewardBps;
        uint16 votingRewardBps;
        uint16 auctionRewardBps;
        uint16 proposalEligibilityQuorumBps;
    }

    constructor(
        address nounsDAO_,
        address auctionHouse_,
        address ethToken_,
        uint32 nextProposalIdToReward_,
        uint256 lastProcessedAuctionId_,
        uint256 nextProposalRewardTimestamp_,
        RewardParams memory rewardParams
    ) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
        ethToken = IERC20(ethToken_);
        nextProposalIdToReward = nextProposalIdToReward_;
        lastProcessedAuctionId = lastProcessedAuctionId_;
        nextProposalRewardTimestamp = nextProposalRewardTimestamp_;
        params = rewardParams;
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
        NounsDAOV3Types.ProposalForRewards proposal;
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
                clientBalances[settlement.clientId] += (settlement.amount * params.auctionRewardBps) / 10_000;
            }
        }
    }

    /**
     *
     * @param expectedNumEligibleProposals should match the number of eligible proposals. TODO: a view function for this
     */
    function updateRewardsForProposalWritingAndVoting(
        uint32 lastProposalId,
        uint256 expectedNumEligibleProposals,
        uint256 expectedNumEligibleVotes,
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

        require(auctionRevenue > 0, 'auctionRevenue must be > 0');

        t.proposalRewardForPeriod = (auctionRevenue * params.proposalRewardBps) / 10000;
        t.votingRewardForPeriod = (auctionRevenue * params.votingRewardBps) / 10000;

        nextProposalRewardTimestamp = t.proposal.creationTimestamp + 1;

        t.rewardPerProposal = t.proposalRewardForPeriod / expectedNumEligibleProposals;
        t.rewardPerVote = t.votingRewardForPeriod / expectedNumEligibleVotes;

        uint32 lowestProposalIdToReward = nextProposalIdToReward;
        nextProposalIdToReward = lastProposalId + 1;

        for (uint32 pid = lastProposalId; pid >= lowestProposalIdToReward; pid--) {
            if (pid != lastProposalId) {
                t.proposal = nounsDAO.proposalDataForRewards(pid);
            }

            // make sure proposal finished voting
            uint endBlock = max(t.proposal.endBlock, t.proposal.objectionPeriodEndBlock);
            require(block.number > endBlock, 'all proposals must be done with voting');

            // skip non eligible proposals TODO: parameterize quorum
            if (t.proposal.forVotes < (t.proposal.totalSupply * params.proposalEligibilityQuorumBps) / 10000) continue;

            // proposal is eligible for reward
            ++t.actualNumEligibleProposals;

            uint32 clientId = t.proposal.clientId;
            if (clientId != 0) {
                clientBalances[clientId] += t.rewardPerProposal;
            }

            uint256 votesInProposal;

            NounsDAOV3Types.ClientVoteData[] memory voteData = nounsDAO.proposalVoteClientsData(pid, votingClientIds);

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
        require(t.actualNumEligibleVotes == expectedNumEligibleVotes, 'wrong expectedNumEligibleVotes');
    }

    function withdrawClientBalance(uint32 clientId, uint256 amount, address to) public {
        require(ownerOf(clientId) == msg.sender, 'must be client NFT owner');

        clientBalances[clientId] -= amount;

        ethToken.transfer(to, amount);
    }

    struct ProposalRewardsParams {
        uint32 lastProposalId;
        uint256 expectedNumEligibleProposals;
        uint256 expectedNumEligibleVotes;
        uint256 firstNounId;
        uint256 lastNounId;
        uint32[] votingClientIds;
    }

    function getParamsForUpdatingProposalRewards() public view returns (ProposalRewardsParams memory p) {
        NounsDAOV3Types.ProposalForRewards memory proposal;
        uint256 maxProposalId = nounsDAO.proposalCount();

        uint32[] memory allClientIds = new uint32[](nextTokenId);
        uint32[] memory votingClientIds = new uint32[](nextTokenId);
        for (uint32 i; i < nextTokenId; i++) allClientIds[i] = i;
        uint256 numVotingClients;

        for (uint32 pid = nextProposalIdToReward; pid <= maxProposalId; pid++) {
            proposal = nounsDAO.proposalDataForRewards(pid);

            uint endBlock = max(proposal.endBlock, proposal.objectionPeriodEndBlock);
            if (block.number <= endBlock) break; // reached a proposal still in voting

            // skip non eligible proposals TODO: parameterize quorum
            if (proposal.forVotes < (proposal.totalSupply * params.proposalEligibilityQuorumBps) / 10000) continue;

            // proposal is eligible for reward
            ++p.expectedNumEligibleProposals;

            uint256 proposalTotalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
            p.expectedNumEligibleVotes += proposalTotalVotes;

            p.lastProposalId = pid;

            NounsDAOV3Types.ClientVoteData[] memory voteData = nounsDAO.proposalVoteClientsData(pid, allClientIds);
            for (uint256 i; i < nextTokenId; i++) {
                if (voteData[i].votes > 0) {
                    if (votingClientIds[i] == 0) {
                        votingClientIds[i] = 1;
                        numVotingClients++;
                    }
                }
            }
        }

        p.votingClientIds = new uint32[](numVotingClients);
        uint32 j;
        for (uint32 i; i < votingClientIds.length; i++) {
            if (votingClientIds[i] == 1) p.votingClientIds[j++] = i;
        }

        (p.firstNounId, p.lastNounId) = findAuctionsBeforeAndAfter(
            nextProposalRewardTimestamp,
            nounsDAO.proposalDataForRewards(p.lastProposalId).creationTimestamp
        );
    }

    function findAuctionsBeforeAndAfter(
        uint256 startTimestamp,
        uint256 endTimestamp
    ) internal view returns (uint256 firstNounId, uint256 lastNounId) {
        require(endTimestamp > startTimestamp, 'endTimestamp > startTimestamp');
        uint256 maxAuctionId = auctionHouse.auction().nounId - 1;

        INounsAuctionHouseV2.Settlement[] memory s;

        uint256 prevAuctionId;
        for (uint256 nounId = maxAuctionId; nounId > 0; nounId--) {
            s = auctionHouse.getSettlements(nounId, nounId + 1, true);

            if (s.length == 0) continue; // nounder reward or missing data

            if (lastNounId == 0) {
                // haven't yet found the last auction id
                // if this auction id is the first to be <= endTimestamp, mark the previous auction as the lastNounID
                if (s[0].blockTimestamp <= endTimestamp)
                    lastNounId = prevAuctionId;
                    // otherwise, just update the previousAuctionId
                else prevAuctionId = nounId;
            }

            if (s[0].blockTimestamp <= startTimestamp) {
                firstNounId = nounId;
                break;
            }
        }
    }

    function getAuctionRevenueForPeriod(
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 firstNounId,
        uint256 lastNounId
    ) internal view returns (uint256) {
        INounsAuctionHouseV2.Settlement[] memory s = auctionHouse.getSettlements(firstNounId, lastNounId + 1, true);
        require(s[0].blockTimestamp < startTimestamp, 'first auction must be before start ts');
        require(s[1].blockTimestamp >= startTimestamp, 'second auction must be after start ts');
        require(s[s.length - 2].blockTimestamp <= endTimestamp, 'second to last auction must be before end ts');
        require(s[s.length - 1].blockTimestamp > endTimestamp, 'last auction must be after end ts');

        return sumAuctionsExcludingFirstAndLast(s);
    }

    function sumAuctionsExcludingFirstAndLast(
        INounsAuctionHouseV2.Settlement[] memory s
    ) internal pure returns (uint256 sum) {
        for (uint256 i = 1; i < s.length - 1; ++i) {
            sum += s[i].amount;
        }
    }

    function registerClient() public returns (uint32) {
        uint32 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }

    function requireProposalEligibleForRewards(NounsDAOV3Types.ProposalCondensed memory proposal) internal view {
        require(proposal.forVotes >= proposal.quorumVotes, 'must reach quorum');

        // voting has ended
        require(block.number > proposal.endBlock, 'voting must end');
        require(block.number > proposal.updatePeriodEndBlock, 'voting must end');
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}
