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
import { NounsDAOTypes } from './governance/NounsDAOInterfaces.sol';
import { NounsClientToken } from './client-incentives/NounsClientToken.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { InMemoryMapping } from './libs/InMemoryMapping.sol';

contract Rewards is NounsClientToken, UUPSUpgradeable, PausableUpgradeable {
    using SafeERC20 for IERC20;
    using InMemoryMapping for InMemoryMapping.Mapping;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   EVENTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    event ClientRewarded(uint32 indexed clientId, uint256 amount);
    event ClientBalanceWithdrawal(uint32 indexed clientId, uint256 amount, address to);
    event AuctionRewardsUpdated(uint256 firstAuctionId, uint256 lastAuctionId);
    event ProposalRewardsUpdated(uint32 firstProposalId, uint32 lastProposalId);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   CONSTANTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice The maximum priority fee used to cap gas refunds
    uint256 public constant MAX_REFUND_PRIORITY_FEE = 2 gwei;

    /// @notice The vote refund gas overhead, including 7K for token transfer and 29K for general transaction overhead
    uint256 public constant REFUND_BASE_GAS = 36000;

    /// @notice The maximum basefee the DAO will refund
    uint256 public constant MAX_REFUND_BASE_FEE = 200 gwei;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   IMMUTABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    INounsDAOLogicV3 public immutable nounsDAO;

    INounsAuctionHouseV2 public immutable auctionHouse;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STORAGE VARIABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    struct RewardParams {
        // @dev Used for proposal rewards
        uint32 minimumRewardPeriod;
        uint8 numProposalsEnoughForReward;
        uint16 proposalRewardBps;
        uint16 votingRewardBps;
        uint16 proposalEligibilityQuorumBps;
        // @dev Used for auction rewards
        uint16 auctionRewardBps;
        uint8 minimumAuctionsBetweenUpdates;
    }

    /// @custom:storage-location erc7201:nouns.rewards
    struct RewardsStorage {
        // @dev Used for auction rewards state
        uint32 nextAuctionIdToReward;
        // @dev Used for proposal rewards state
        uint32 nextProposalIdToReward;
        uint32 nextProposalRewardFirstAuctionId;
        uint40 lastProposalRewardsUpdate;
        // @dev Params for both auction & rewards
        RewardParams params;
        IERC20 ethToken;
        address admin;
        mapping(uint32 clientId => uint256 balance) _clientBalances;
    }

    /// @dev This is a ERC-7201 storage location, calculated using:
    /// @dev keccak256(abi.encode(uint256(keccak256("nouns.rewards")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 public constant RewardsStorageLocation = 0x9a06af3161ac5b0c3de4e6c981ab9d9f60b530386f5eaae00d541393fbecd700;

    function _getRewardsStorage() private pure returns (RewardsStorage storage $) {
        assembly {
            $.slot := RewardsStorageLocation
        }
    }

    /**
     * @dev Throws if called by any account other than the owner or admin.
     */
    modifier onlyOwnerOrAdmin() {
        RewardsStorage storage $ = _getRewardsStorage();
        require(owner() == _msgSender() || $.admin == _msgSender(), 'Caller must be owner or admin');
        _;
    }

    /**
     * @dev This constructor does not have the `initializer` modifier, since it inherits from `NounsClientToken` which
     * has the `initializer` modifier on its constructor.
     */
    constructor(address nounsDAO_, address auctionHouse_) {
        nounsDAO = INounsDAOLogicV3(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
    }

    function initialize(
        address owner,
        address admin_,
        address ethToken_,
        uint32 nextProposalIdToReward_,
        uint32 nextAuctionIdToReward_,
        uint32 nextProposalRewardFirstAuctionId_,
        RewardParams memory rewardParams,
        address descriptor
    ) public initializer {
        RewardsStorage storage $ = _getRewardsStorage();

        super.initialize(owner, descriptor);
        __Pausable_init_unchained();
        $.admin = admin_;
        $.ethToken = IERC20(ethToken_);
        $.nextProposalIdToReward = nextProposalIdToReward_;
        $.nextAuctionIdToReward = nextAuctionIdToReward_;
        $.nextProposalRewardFirstAuctionId = nextProposalRewardFirstAuctionId_;
        $.params = rewardParams;
        $.lastProposalRewardsUpdate = uint40(block.timestamp);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC WRITE
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Register a client, mints an NFT and assigns a clientId
     * @return uint32 the newly assigned clientId
     */
    function registerClient(
        string calldata name,
        string calldata description
    ) public override whenNotPaused returns (uint32) {
        RewardsStorage storage $ = _getRewardsStorage();

        uint32 tokenId = super.registerClient(name, description);

        // Increase the balance by one wei so that the slot is non zero when increased in the future
        $._clientBalances[tokenId] += 1;

        return tokenId;
    }

    function updateRewardsForAuctions(uint32 lastNounId) public whenNotPaused {
        uint256 startGas = gasleft();
        RewardsStorage storage $ = _getRewardsStorage();

        bool sawNonZeroClientId = false;
        uint256 nextAuctionIdToReward_ = $.nextAuctionIdToReward;
        require(
            lastNounId >= nextAuctionIdToReward_ + $.params.minimumAuctionsBetweenUpdates,
            'lastNounId must be higher'
        );
        $.nextAuctionIdToReward = lastNounId + 1;

        INounsAuctionHouseV2.Settlement[] memory settlements = auctionHouse.getSettlements(
            nextAuctionIdToReward_,
            lastNounId + 1,
            true
        );
        INounsAuctionHouseV2.Settlement memory lastSettlement = settlements[settlements.length - 1];
        require(lastSettlement.nounId == lastNounId && lastSettlement.blockTimestamp > 1, 'lastNounId must be settled');

        InMemoryMapping.Mapping memory m = InMemoryMapping.createMapping({ maxClientId: nextTokenId() - 1 });

        for (uint256 i; i < settlements.length; ++i) {
            INounsAuctionHouseV2.Settlement memory settlement = settlements[i];
            if (settlement.clientId > 0) {
                sawNonZeroClientId = true;
                m.inc(settlement.clientId, settlement.amount);
            }
        }

        uint16 auctionRewardBps = $.params.auctionRewardBps;
        uint256 numValues = m.numValues();
        for (uint32 i = 0; i < numValues; ++i) {
            InMemoryMapping.ClientBalance memory cb = m.getValue(i);
            uint256 reward = (cb.balance * auctionRewardBps) / 10_000;
            uint32 clientId = cb.clientId;
            $._clientBalances[clientId] += reward;

            emit ClientRewarded(clientId, reward);
        }

        emit AuctionRewardsUpdated(nextAuctionIdToReward_, lastNounId);

        if (sawNonZeroClientId) {
            // refund gas only if we're actually rewarding a client, not just moving the pointer
            _refundGas(startGas);
        }
    }

    struct Temp {
        uint256 numEligibleVotes;
        uint256 numEligibleProposals;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
        uint256 proposalRewardForPeriod;
        uint256 votingRewardForPeriod;
        uint32 nextProposalIdToReward;
        NounsDAOTypes.ProposalForRewards lastProposal;
    }

    /**
     * @param lastProposalId id of the last proposal to include in the rewards distribution. all proposals up to and
     * including this id must have ended voting.
     * @param votingClientIds array of sorted client ids that were used to vote on of all eligible the eligible proposals in
     * this rewards distribution. reverts if contains duplicates. reverts if not sorted. reverts if a clientId had zero votes.
     */
    function updateRewardsForProposalWritingAndVoting(
        uint32 lastProposalId,
        uint32[] calldata votingClientIds
    ) public whenNotPaused {
        uint256 startGas = gasleft();
        RewardsStorage storage $ = _getRewardsStorage();

        Temp memory t;

        t.nextProposalIdToReward = $.nextProposalIdToReward;

        require(lastProposalId <= nounsDAO.proposalCount(), 'bad lastProposalId');
        require(lastProposalId >= t.nextProposalIdToReward, 'bad lastProposalId');
        require(isSortedAndNoDuplicates(votingClientIds), 'must be sorted & unique');

        emit ProposalRewardsUpdated(t.nextProposalIdToReward, lastProposalId);

        NounsDAOTypes.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards(
            t.nextProposalIdToReward,
            lastProposalId,
            votingClientIds
        );
        $.nextProposalIdToReward = lastProposalId + 1;

        t.lastProposal = proposals[proposals.length - 1];

        (uint256 auctionRevenue, uint256 lastAuctionId) = getAuctionRevenue({
            firstNounId: $.nextProposalRewardFirstAuctionId,
            endTimestamp: t.lastProposal.creationTimestamp
        });
        $.nextProposalRewardFirstAuctionId = uint32(lastAuctionId) + 1;

        require(auctionRevenue > 0, 'auctionRevenue must be > 0');

        t.proposalRewardForPeriod = (auctionRevenue * $.params.proposalRewardBps) / 10_000;
        t.votingRewardForPeriod = (auctionRevenue * $.params.votingRewardBps) / 10_000;

        uint16 proposalEligibilityQuorumBps_ = $.params.proposalEligibilityQuorumBps;

        //// First loop over the proposals:
        //// 1. Make sure all proposals have finished voting.
        //// 2. Delete (zero out) proposals that are non elgibile (i.e. not enough For votes).
        //// 3. Count the number of eligible proposals.
        //// 4. Count the number of votes in eligible proposals.

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
            ++t.numEligibleProposals;

            uint256 votesInProposal = proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes;
            t.numEligibleVotes += votesInProposal;
        }

        //// Check that distribution is allowed:
        //// 1. At least one eligible proposal.
        //// 2. One of the two conditions must be true:
        //// 2.a. Number of eligible proposals is at least `numProposalsEnoughForReward`.
        //// 2.b. At least `minimumRewardPeriod` seconds have passed since the last update.

        require(t.numEligibleProposals > 0, 'at least one eligible proposal');
        if (t.numEligibleProposals < $.params.numProposalsEnoughForReward) {
            require(
                t.lastProposal.creationTimestamp > $.lastProposalRewardsUpdate + $.params.minimumRewardPeriod,
                'not enough time passed'
            );
        }
        $.lastProposalRewardsUpdate = uint40(t.lastProposal.creationTimestamp);

        // Calculate the reward per proposal and per vote
        t.rewardPerProposal = t.proposalRewardForPeriod / t.numEligibleProposals;
        t.rewardPerVote = t.votingRewardForPeriod / t.numEligibleVotes;

        //// Second loop over the proposals:
        //// 1. Skip proposals that were deleted for non eligibility.
        //// 2. Reward proposal's clientId.
        //// 3. Reward the clientIds that faciliated voting.
        //// 4. Make sure all voting clientIds were included.

        InMemoryMapping.Mapping memory m = InMemoryMapping.createMapping({ maxClientId: nextTokenId() - 1 });

        for (uint256 i; i < proposals.length; ++i) {
            // skip non eligible deleted proposals
            if (proposals[i].endBlock == 0) continue;

            uint32 clientId = proposals[i].clientId;
            if (clientId != 0) {
                m.inc(clientId, t.rewardPerProposal);
            }

            uint256 votesInProposal;
            NounsDAOTypes.ClientVoteData[] memory voteData = proposals[i].voteData;
            for (uint256 j; j < votingClientIds.length; ++j) {
                clientId = votingClientIds[j];
                uint256 votes = voteData[j].votes;
                require(votes > 0, 'all clientId must have votes');
                if (clientId != 0) {
                    m.inc(clientId, votes * t.rewardPerVote);
                }
                votesInProposal += votes;
            }
            require(
                votesInProposal == proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes,
                'not all votes accounted'
            );
        }

        uint256 numValues = m.numValues();
        for (uint32 i = 0; i < numValues; ++i) {
            InMemoryMapping.ClientBalance memory cb = m.getValue(i);
            uint256 reward = cb.balance;
            uint32 clientId = cb.clientId;
            $._clientBalances[clientId] += reward;

            emit ClientRewarded(clientId, reward);
        }

        _refundGas(startGas);
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
    function withdrawClientBalance(uint32 clientId, uint256 amount, address to) public whenNotPaused {
        RewardsStorage storage $ = _getRewardsStorage();

        require(ownerOf(clientId) == msg.sender, 'must be client NFT owner');
        require(amount < $._clientBalances[clientId], 'amount too large');

        $._clientBalances[clientId] -= amount;

        emit ClientBalanceWithdrawal(clientId, amount, to);

        $.ethToken.safeTransfer(to, amount);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC READ
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Returns the withdrawable balance of client with id `clientId`
     * @dev accounts for the extra wei used for gas optimization
     */
    function clientBalance(uint32 clientId) public view returns (uint256) {
        RewardsStorage storage $ = _getRewardsStorage();

        uint256 balance = $._clientBalances[clientId];
        if (balance > 0) {
            // accounting for the extra 1 wei added to the balance for gas optimizations
            balance--;
        }
        return balance;
    }

    /**
     * @notice Returns the clientIds that is needed to be passed as a parameter to updateRewardsForProposalWritingAndVoting
     * @dev This is not meant to be called onchain because it may be very gas intensive.
     */
    function getVotingClientIds(uint32 lastProposalId) public view returns (uint32[] memory) {
        RewardsStorage storage $ = _getRewardsStorage();

        uint256 numClientIds = nextTokenId();
        uint32[] memory allClientIds = new uint32[](numClientIds);
        for (uint32 i; i < numClientIds; ++i) {
            allClientIds[i] = i;
        }
        NounsDAOTypes.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards(
            $.nextProposalIdToReward,
            lastProposalId,
            allClientIds
        );

        uint32[] memory sumVotes = new uint32[](numClientIds);
        for (uint256 i; i < proposals.length; ++i) {
            for (uint256 j; j < numClientIds; ++j) {
                sumVotes[j] += proposals[i].voteData[j].votes;
            }
        }

        uint256 idx;
        uint32[] memory nonZeroClientIds = new uint32[](numClientIds);
        for (uint32 i; i < numClientIds; ++i) {
            if (sumVotes[i] > 0) nonZeroClientIds[idx++] = i;
        }

        assembly {
            mstore(nonZeroClientIds, idx)
        }

        return nonZeroClientIds;
    }

    function getAuctionRevenue(
        uint256 firstNounId,
        uint256 endTimestamp
    ) public view returns (uint256 sumRevenue, uint256 lastAuctionId) {
        INounsAuctionHouseV2.Settlement[] memory s = auctionHouse.getSettlementsFromIdtoTimestamp(
            firstNounId,
            endTimestamp,
            true
        );
        sumRevenue = sumAuctions(s);
        lastAuctionId = s[s.length - 1].nounId;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC READ - STORAGE GETTERS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function nextAuctionIdToReward() public view returns (uint256) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.nextAuctionIdToReward;
    }

    function nextProposalIdToReward() public view returns (uint32) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.nextProposalIdToReward;
    }

    function nextProposalRewardFirstAuctionId() public view returns (uint256) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.nextProposalRewardFirstAuctionId;
    }

    function lastProposalRewardsUpdate() public view returns (uint256) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.lastProposalRewardsUpdate;
    }

    function getParams() public view returns (RewardParams memory) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.params;
    }

    function ethToken() public view returns (IERC20) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.ethToken;
    }

    function admin() public view returns (address) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.admin;
    }

    /**
     * @notice Returns the raw value from _clientBalances mapping. Usually you want to use `clientBalance`
     */
    function _clientBalances(uint32 clientId) public view returns (uint256) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $._clientBalances[clientId];
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function setParams(RewardParams calldata newParams) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.params = newParams;
    }

    function pause() public onlyOwnerOrAdmin {
        _pause();
    }

    function unpause() public onlyOwnerOrAdmin {
        _unpause();
    }

    function setAdmin(address newAdmin) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.admin = newAdmin;
    }

    function setETHToken(address newToken) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.ethToken = IERC20(newToken);
    }

    function withdrawToken(address token, address to, uint256 amount) public onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function sumAuctions(INounsAuctionHouseV2.Settlement[] memory s) internal pure returns (uint256 sum) {
        for (uint256 i = 0; i < s.length; ++i) {
            sum += s[i].amount;
        }
    }

    /// @dev refunds gas using the `ethToken` instead of ETH
    function _refundGas(uint256 startGas) internal {
        RewardsStorage storage $ = _getRewardsStorage();
        IERC20 ethToken_ = $.ethToken;
        unchecked {
            uint256 balance = ethToken_.balanceOf(address(this));
            if (balance == 0) {
                return;
            }
            uint256 basefee = min(block.basefee, MAX_REFUND_BASE_FEE);
            uint256 gasPrice = min(tx.gasprice, basefee + MAX_REFUND_PRIORITY_FEE);
            uint256 gasUsed = startGas - gasleft() + REFUND_BASE_GAS;
            uint256 refundAmount = min(gasPrice * gasUsed, balance);
            ethToken_.safeTransfer(tx.origin, refundAmount);
        }
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev returns true if ids is an array of increasing unique values, i.e. sorted ascending and no duplicates
     */
    function isSortedAndNoDuplicates(uint32[] memory ids) internal pure returns (bool) {
        uint256 len = ids.length;
        uint32 prevValue = ids[0];
        for (uint256 i = 1; i < len; ++i) {
            uint32 nextValue = ids[i];
            if (nextValue <= prevValue) return false;
            prevValue = nextValue;
        }
        return true;
    }

    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
