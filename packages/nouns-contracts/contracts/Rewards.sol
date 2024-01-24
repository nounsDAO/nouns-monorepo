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
    uint256 public nextProposalRewardFirstAuctionId;
    uint256 lastProposalRewardsUpdate = block.timestamp;
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
        uint256 nextProposalRewardFirstAuctionId_,
        RewardParams memory rewardParams
    ) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
        ethToken = IERC20(ethToken_);
        nextProposalIdToReward = nextProposalIdToReward_;
        lastProcessedAuctionId = lastProcessedAuctionId_;
        nextProposalRewardFirstAuctionId = nextProposalRewardFirstAuctionId_;
        params = rewardParams;
    }

    struct Temp {
        uint256 numEligibleVotes;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
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
     * @param lastAuctionedNounId the noun id that was auctioned when proposal with id `lastProposalId` was created.
     * The auction revenue up to this noun id are included in the bounty.
     */
    function updateRewardsForProposalWritingAndVoting(
        uint32 lastProposalId,
        uint256 lastAuctionedNounId,
        uint32[] calldata votingClientIds
    ) public {
        require(lastProposalId <= nounsDAO.proposalCount(), 'bad lastProposalId');
        require(lastProposalId >= nextProposalIdToReward, 'bad lastProposalId');

        Temp memory t;

        NounsDAOV3Types.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards(
            nextProposalIdToReward,
            lastProposalId,
            votingClientIds
        );
        nextProposalIdToReward = lastProposalId + 1;

        NounsDAOV3Types.ProposalForRewards memory lastProposal = proposals[proposals.length - 1];

        uint256 auctionRevenue = getAuctionRevenueBetweenNouns({
            firstNounId: nextProposalRewardFirstAuctionId,
            oneAfterLastNounId: lastAuctionedNounId,
            endTimestamp: lastProposal.creationTimestamp
        });
        nextProposalRewardFirstAuctionId = lastAuctionedNounId;

        require(auctionRevenue > 0, 'auctionRevenue must be > 0');

        uint256 proposalRewardForPeriod = (auctionRevenue * params.proposalRewardBps) / 10000;
        uint256 votingRewardForPeriod = (auctionRevenue * params.votingRewardBps) / 10000;

        uint16 proposalEligibilityQuorumBps_ = params.proposalEligibilityQuorumBps;

        uint256 numEligibleProposals;
        for (uint256 i; i < proposals.length; ++i) {
            // make sure proposal finished voting
            uint endBlock = max(proposals[i].endBlock, proposals[i].objectionPeriodEndBlock);
            require(block.number > endBlock, 'all proposals must be done with voting');

            // skip non eligible proposals
            if (proposals[i].forVotes < (proposals[i].totalSupply * proposalEligibilityQuorumBps_) / 10000) {
                delete proposals[i];
                continue;
            }

            // proposal is eligible for reward
            ++numEligibleProposals;

            uint256 votesInProposal = proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes;
            t.numEligibleVotes += votesInProposal;
        }

        require(numEligibleProposals > 0, 'at least one eligible proposal');
        if (numEligibleProposals < numProposalsEnoughForReward) {
            require(
                lastProposal.creationTimestamp > lastProposalRewardsUpdate + minimumRewardPeriod,
                'not enough time passed'
            );
        }
        lastProposalRewardsUpdate = lastProposal.creationTimestamp + 1;

        t.rewardPerProposal = proposalRewardForPeriod / numEligibleProposals;
        t.rewardPerVote = votingRewardForPeriod / t.numEligibleVotes;

        for (uint256 i; i < proposals.length; ++i) {
            // skip non eligible deleted proposals
            if (proposals[i].endBlock == 0) continue;

            uint32 clientId = proposals[i].clientId;
            if (clientId != 0) {
                clientBalances[clientId] += t.rewardPerProposal;
            }

            uint256 votesInProposal;

            NounsDAOV3Types.ClientVoteData[] memory voteData = proposals[i].voteData;

            uint256 votes;
            for (uint256 j; j < votingClientIds.length; ++j) {
                clientId = votingClientIds[j];
                votes = voteData[j].votes;
                if (clientId != 0) {
                    clientBalances[clientId] += votes * t.rewardPerVote;
                }
                votesInProposal += votes;
            }
            require(
                votesInProposal == proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes,
                'not all votes accounted'
            );
        }
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

    function getAuctionRevenueBetweenNouns(
        uint256 firstNounId,
        uint256 oneAfterLastNounId,
        uint256 endTimestamp
    ) internal view returns (uint256) {
        INounsAuctionHouseV2.Settlement[] memory s = auctionHouse.getSettlements(
            firstNounId,
            oneAfterLastNounId + 1,
            true
        );
        require(s[s.length - 2].blockTimestamp <= endTimestamp, 'second to last auction must be before end ts');
        require(s[s.length - 1].blockTimestamp > endTimestamp, 'last auction must be after end ts');

        return sumAuctionsExcludingLast(s);
    }

    function sumAuctionsExcludingLast(INounsAuctionHouseV2.Settlement[] memory s) internal pure returns (uint256 sum) {
        for (uint256 i = 0; i < s.length - 1; ++i) {
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
