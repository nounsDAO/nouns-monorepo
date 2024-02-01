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
import { NounsClientToken } from './client-incentives/NounsClientToken.sol';
import { IERC20 } from '@openzeppelin/contracts-v5/token/ERC20/IERC20.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable-v5/proxy/utils/UUPSUpgradeable.sol';

contract Rewards is NounsClientToken, UUPSUpgradeable {
    INounsDAOLogicV3 public immutable nounsDAO;
    INounsAuctionHouseV2 public immutable auctionHouse;

    uint32 public nextProposalIdToReward;
    uint256 public nextAuctionIdToReward;
    uint256 public nextProposalRewardFirstAuctionId;
    uint256 lastProposalRewardsUpdate;

    RewardParams public params;

    IERC20 public ethToken; // TODO make configurable

    mapping(uint32 clientId => uint256 balance) public _clientBalances;

    struct RewardParams {
        uint32 minimumRewardPeriod;
        uint8 numProposalsEnoughForReward;
        uint16 proposalRewardBps;
        uint16 votingRewardBps;
        uint16 auctionRewardBps;
        uint16 proposalEligibilityQuorumBps;
    }

    constructor(address nounsDAO_, address auctionHouse_) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
        _disableInitializers();
    }

    function initialize(
        address owner,
        address ethToken_,
        uint32 nextProposalIdToReward_,
        uint256 nextAuctionIdToReward_,
        uint256 nextProposalRewardFirstAuctionId_,
        RewardParams memory rewardParams,
        address descriptor
    ) public initializer {
        super.initialize(owner, descriptor);
        ethToken = IERC20(ethToken_);
        nextProposalIdToReward = nextProposalIdToReward_;
        nextAuctionIdToReward = nextAuctionIdToReward_;
        nextProposalRewardFirstAuctionId = nextProposalRewardFirstAuctionId_;
        params = rewardParams;
        lastProposalRewardsUpdate = block.timestamp;
    }

    function setParams(RewardParams calldata newParams) public onlyOwner {
        params = newParams;
    }

    function getParams() public view returns (RewardParams memory) {
        return params;
    }

    function updateRewardsForAuctions(uint256 lastNounId) public {
        uint256 nextAuctionIdToReward_ = nextAuctionIdToReward;
        require(lastNounId >= nextAuctionIdToReward_, 'lastNounId must be higher');
        nextAuctionIdToReward = lastNounId + 1;

        INounsAuctionHouseV2.Settlement[] memory settlements = auctionHouse.getSettlements(
            nextAuctionIdToReward_,
            lastNounId + 1,
            true
        );
        INounsAuctionHouseV2.Settlement memory lastSettlement = settlements[settlements.length - 1];
        require(lastSettlement.nounId == lastNounId && lastSettlement.blockTimestamp > 1, 'lastNounId must be settled');

        uint16 auctionRewardBps = params.auctionRewardBps;
        for (uint256 i; i < settlements.length; ++i) {
            INounsAuctionHouseV2.Settlement memory settlement = settlements[i];
            if (settlement.clientId > 0) {
                _clientBalances[settlement.clientId] += (settlement.amount * auctionRewardBps) / 10_000;
            }
        }
    }

    struct Temp {
        uint256 numEligibleVotes;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
        uint256 proposalRewardForPeriod;
    }

    /**
     * @param lastProposalId id of the last proposal to include in the rewards distribution. all proposals up to and
     * including this id must have ended voting.
     * @param votingClientIds array of client ids that were used to vote on of all eligible the eligible proposals in
     * this rewards distribution
     */
    function updateRewardsForProposalWritingAndVoting(uint32 lastProposalId, uint32[] calldata votingClientIds) public {
        require(lastProposalId <= nounsDAO.proposalCount(), 'bad lastProposalId');
        require(lastProposalId >= nextProposalIdToReward, 'bad lastProposalId');

        NounsDAOV3Types.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards(
            nextProposalIdToReward,
            lastProposalId,
            votingClientIds
        );
        nextProposalIdToReward = lastProposalId + 1;

        NounsDAOV3Types.ProposalForRewards memory lastProposal = proposals[proposals.length - 1];

        (uint256 auctionRevenue, uint256 lastAuctionId) = getAuctionRevenue({
            firstNounId: nextProposalRewardFirstAuctionId,
            endTimestamp: lastProposal.creationTimestamp
        });
        nextProposalRewardFirstAuctionId = lastAuctionId + 1;

        require(auctionRevenue > 0, 'auctionRevenue must be > 0');

        Temp memory t;

        t.proposalRewardForPeriod = (auctionRevenue * params.proposalRewardBps) / 10_000;
        uint256 votingRewardForPeriod = (auctionRevenue * params.votingRewardBps) / 10_000;

        uint16 proposalEligibilityQuorumBps_ = params.proposalEligibilityQuorumBps;

        //// First loop over the proposals:
        //// 1. Make sure all proposals have finished voting.
        //// 2. Delete (zero out) proposals that are non elgibile (i.e. not enough For votes).
        //// 3. Count the number of eligible proposals.
        //// 4. Count the number of votes in eligible proposals.

        uint256 numEligibleProposals;
        for (uint256 i; i < proposals.length; ++i) {
            // make sure proposal finished voting
            uint endBlock = max(proposals[i].endBlock, proposals[i].objectionPeriodEndBlock);
            require(block.number > endBlock, 'all proposals must be done with voting');

            // skip non eligible proposals
            if (proposals[i].forVotes < (proposals[i].totalSupply * proposalEligibilityQuorumBps_) / 10_000) {
                delete proposals[i];
                continue;
            }

            // proposal is eligible for reward
            ++numEligibleProposals;

            uint256 votesInProposal = proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes;
            t.numEligibleVotes += votesInProposal;
        }

        //// Check that distribution is allowed:
        //// 1. At least one eligible proposal.
        //// 2. One of the two conditions must be true:
        //// 2.a. Number of eligible proposals is at least `numProposalsEnoughForReward`.
        //// 2.b. At least `minimumRewardPeriod` seconds have passed since the last update.

        require(numEligibleProposals > 0, 'at least one eligible proposal');
        if (numEligibleProposals < params.numProposalsEnoughForReward) {
            require(
                lastProposal.creationTimestamp > lastProposalRewardsUpdate + params.minimumRewardPeriod,
                'not enough time passed'
            );
        }
        lastProposalRewardsUpdate = lastProposal.creationTimestamp;

        // Calculate the reward per proposal and per vote
        t.rewardPerProposal = t.proposalRewardForPeriod / numEligibleProposals;
        t.rewardPerVote = votingRewardForPeriod / t.numEligibleVotes;

        //// Second loop over the proposals:
        //// 1. Skip proposals that were deleted for non eligibility.
        //// 2. Reward proposal's clientId.
        //// 3. Reward the clientIds that faciliated voting.
        //// 4. Make sure all voting clientIds were included.

        for (uint256 i; i < proposals.length; ++i) {
            // skip non eligible deleted proposals
            if (proposals[i].endBlock == 0) continue;

            uint32 clientId = proposals[i].clientId;
            if (clientId != 0) {
                _clientBalances[clientId] += t.rewardPerProposal;
            }

            uint256 votesInProposal;
            NounsDAOV3Types.ClientVoteData[] memory voteData = proposals[i].voteData;
            uint256 votes;
            for (uint256 j; j < votingClientIds.length; ++j) {
                clientId = votingClientIds[j];
                votes = voteData[j].votes;
                if (clientId != 0) {
                    _clientBalances[clientId] += votes * t.rewardPerVote;
                }
                votesInProposal += votes;
            }
            require(
                votesInProposal == proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes,
                'not all votes accounted'
            );
        }
    }

    /**
     * @notice Withdraws the balance of a client
     * @dev The caller must be the owner of the NFT with id `clientId`
     * @dev The maximum value of `amount` is one less than in `_clientBalances[clientId]`.
     * This in order to leave 1 wei in storage and avoid expensive gas writes in future balance increases.
     * @param clientId Which client balance to withdraw
     * @param amount amount of withdraw
     * @param to the address to withdraw to
     */
    function withdrawClientBalance(uint32 clientId, uint256 amount, address to) public {
        require(ownerOf(clientId) == msg.sender, 'must be client NFT owner');
        require(amount < _clientBalances[clientId], 'amount too large');

        _clientBalances[clientId] -= amount;

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

    function getAuctionRevenue(
        uint256 firstNounId,
        uint256 endTimestamp
    ) internal view returns (uint256 sumRevenue, uint256 lastAuctionId) {
        INounsAuctionHouseV2.Settlement[] memory s = auctionHouse.getSettlementsFromIdtoTimestamp(
            firstNounId,
            endTimestamp,
            true
        );
        sumRevenue = sumAuctions(s);
        lastAuctionId = s[s.length - 1].nounId;
    }

    function sumAuctions(INounsAuctionHouseV2.Settlement[] memory s) internal pure returns (uint256 sum) {
        for (uint256 i = 0; i < s.length; ++i) {
            sum += s[i].amount;
        }
    }

    function registerClient(string calldata name, string calldata description) public override returns (uint32) {
        uint32 tokenId = super.registerClient(name, description);
        _clientBalances[tokenId] += 1;
        return tokenId;
    }

    /**
     * @notice Returns the withdrawable balance of client with id `clientId`
     * @dev accounts for the extra wei used for gas optimization
     */
    function clientBalance(uint32 clientId) public view returns (uint256) {
        uint256 balance = _clientBalances[clientId];
        if (balance > 0) {
            // accounting for the extra 1 wei added to the balance for gas optimizations
            balance--;
        }
        return balance;
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
