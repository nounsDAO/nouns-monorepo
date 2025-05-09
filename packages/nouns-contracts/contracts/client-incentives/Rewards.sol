// SPDX-License-Identifier: GPL-3.0

/// @title The client incentives rewards logic

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

import { INounsDAOLogic } from '../interfaces/INounsDAOLogic.sol';
import { INounsAuctionHouseV2 } from '../interfaces/INounsAuctionHouseV2.sol';
import { NounsDAOTypes } from '../governance/NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ClientRewardsMemoryMapping } from '../libs/ClientRewardsMemoryMapping.sol';
import { GasRefund } from '../libs/GasRefund.sol';
import { INounsClientTokenDescriptor } from './INounsClientTokenDescriptor.sol';
import { INounsClientTokenTypes } from './INounsClientTokenTypes.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { ERC721Upgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import { SafeCast } from '@openzeppelin/contracts/utils/math/SafeCast.sol';

contract Rewards is
    UUPSUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    INounsClientTokenTypes
{
    using SafeERC20 for IERC20;
    using ClientRewardsMemoryMapping for ClientRewardsMemoryMapping.Mapping;

    error RewardsDisabled();
    error OnlyOwnerOrAdmin();
    error OnlyNFTOwner();
    error LastNounIdMustBeSettled();
    error LastNounIdMustBeHigher();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   EVENTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    event ClientRegistered(uint32 indexed clientId, string name, string description);
    event ClientUpdated(uint32 indexed clientId, string name, string description);
    event ClientRewarded(uint32 indexed clientId, uint256 amount);
    event ClientBalanceWithdrawal(uint32 indexed clientId, uint256 amount, address to);
    event AuctionRewardsUpdated(uint256 firstAuctionId, uint256 lastAuctionId);
    event ProposalRewardsUpdated(
        uint32 firstProposalId,
        uint32 lastProposalId,
        uint256 firstAuctionIdForRevenue,
        uint256 lastAuctionIdForRevenue,
        uint256 auctionRevenue,
        uint256 rewardPerProposal,
        uint256 rewardPerVote
    );
    event ClientApprovalSet(uint32 indexed clientId, bool approved);
    event AuctionRewardsEnabled(uint32 nextAuctionIdToReward);
    event AuctionRewardsDisabled();
    event ProposalRewardsEnabled(uint32 nextProposalIdToReward, uint32 nextProposalRewardFirstAuctionId);
    event ProposalRewardsDisabled();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   IMMUTABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice Nouns DAO proxy contract
    INounsDAOLogic public immutable nounsDAO;

    /// @notice Nouns Auction House proxy contract
    INounsAuctionHouseV2 public immutable auctionHouse;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STORAGE VARIABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    struct ProposalRewardParams {
        /// @dev The minimum reward period for proposal updates if number of proposals is below `numProposalsEnoughForReward`
        uint32 minimumRewardPeriod;
        /// @dev The number of proposals required for an update before `minimumRewardPeriod` has passed
        uint8 numProposalsEnoughForReward;
        /// @dev How much bips out of the auction revenue during this period to use for rewarding proposal creation
        uint16 proposalRewardBps;
        /// @dev How much bips out of the auction revenue during this period to use for rewarding proposal voting
        uint16 votingRewardBps;
        /// @dev How many (in bips) FOR votes out of total votes are required for a proposal to be eligible for rewards
        uint16 proposalEligibilityQuorumBps;
    }

    struct AuctionRewardParams {
        /// @dev How much bips out of auction revnue to use for rewarding auction bidding
        uint16 auctionRewardBps;
        /// @dev Minimum number of auctions between updates. Zero means 1 auction is enough.
        uint8 minimumAuctionsBetweenUpdates;
    }

    /// @custom:storage-location erc7201:nouns.rewards
    struct RewardsStorage {
        /// @dev The next client token id to be minted
        uint32 nextTokenId;
        /// @dev Flag controlling if auction rewards are enabled
        bool auctionRewardsEnabled;
        /// @dev Used for auction rewards state
        uint32 nextAuctionIdToReward;
        /// @dev Flag controlling if proposal rewards are enabled
        bool proposalRewardsEnabled;
        /// @dev Used for proposal rewards state
        uint32 nextProposalIdToReward;
        /// @dev The first auction id to consider for revenue tracking on the next proposal rewards update
        uint32 nextProposalRewardFirstAuctionId;
        /// @dev Last time the proposal rewards update was performed
        uint40 lastProposalRewardsUpdate;
        /// @dev Params for both proposal rewards
        ProposalRewardParams proposalRewardParams;
        /// @dev Params for auction rewards
        AuctionRewardParams auctionRewardParams;
        /// @dev An ETH pegged ERC20 token to use for rewarding
        IERC20 ethToken;
        /// @dev admin account able to pause/unpause the contract in case of a quick response is needed
        address admin;
        /// @dev client metadata per clientId, including rewards balances, name, description
        mapping(uint32 clientId => ClientMetadata) _clientMetadata;
        /// @dev The client NFT descriptor
        address descriptor;
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
     * @dev Reverts if called by any account other than the owner or admin.
     */
    modifier onlyOwnerOrAdmin() {
        RewardsStorage storage $ = _getRewardsStorage();
        if (!(owner() == _msgSender() || $.admin == _msgSender())) revert OnlyOwnerOrAdmin();
        _;
    }

    constructor(address nounsDAO_, address auctionHouse_) initializer {
        nounsDAO = INounsDAOLogic(nounsDAO_);
        auctionHouse = INounsAuctionHouseV2(auctionHouse_);
    }

    /**
     * @param owner Address of the owner who has administration permissions as well as contract upgrade permissions
     * @param admin_ Address which has permissions to pause and unpause
     * @param ethToken_ An ETH pegged token (e.g. WETH) which will be used for rewards and gas refunds
     * @param descriptor_ Address of a INounsClientTokenDescriptor contract to provide tokenURI for the NFTs
     */
    function initialize(address owner, address admin_, address ethToken_, address descriptor_) public initializer {
        __Pausable_init_unchained();
        __ERC721_init('Nouns Client Token', 'NOUNSCLIENT');

        RewardsStorage storage $ = _getRewardsStorage();
        $.nextTokenId = 1;

        _transferOwnership(owner);
        $.admin = admin_;
        $.ethToken = IERC20(ethToken_);
        $.descriptor = descriptor_;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC WRITE
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Register a client, mints an NFT and assigns a clientId
     * @param name a short name identifying the client
     * @param description a longer description for the client, ideally a URL
     * @return uint32 the newly assigned clientId
     */
    function registerClient(string calldata name, string calldata description) external whenNotPaused returns (uint32) {
        RewardsStorage storage $ = _getRewardsStorage();

        uint32 tokenId = $.nextTokenId;
        $.nextTokenId = tokenId + 1;
        _mint(msg.sender, tokenId);

        ClientMetadata storage md = $._clientMetadata[tokenId];
        md.name = name;
        md.description = description;

        emit ClientRegistered(tokenId, name, description);

        return tokenId;
    }

    /**
     * @notice Update the metadata of a client
     * @dev Only the owner of the client token can update the metadata.
     * @param tokenId The token ID of the client
     * @param name The new name of the client
     * @param description The new description of the client
     */
    function updateClientMetadata(uint32 tokenId, string calldata name, string calldata description) external {
        RewardsStorage storage $ = _getRewardsStorage();

        if (ownerOf(tokenId) != msg.sender) revert OnlyNFTOwner();
        ClientMetadata storage md = $._clientMetadata[tokenId];
        md.name = name;
        md.description = description;

        emit ClientUpdated(tokenId, name, description);
    }

    /**
     * @notice Distribute rewards for auction bidding since the last update until auction with id `lastNounId`
     * If an auction's winning bid was called with a clientId, that client will be reward with `params.auctionRewardBps`
     * bips of the auction's settlement amount.
     * At least `minimumAuctionsBetweenUpdates` must happen between updates.
     * Gas spent is refunded in `ethToken`.
     * @param lastNounId the last auction id to reward client for. must be already settled.
     * @dev Gas is refunded if at least one auction was rewarded
     */
    function updateRewardsForAuctions(uint32 lastNounId) public whenNotPaused {
        uint256 startGas = gasleft();
        RewardsStorage storage $ = _getRewardsStorage();
        if (!$.auctionRewardsEnabled) revert RewardsDisabled();

        bool sawValidClientId = false;
        uint256 nextAuctionIdToReward_ = $.nextAuctionIdToReward;
        if (lastNounId < nextAuctionIdToReward_ + $.auctionRewardParams.minimumAuctionsBetweenUpdates)
            revert LastNounIdMustBeHigher();

        $.nextAuctionIdToReward = lastNounId + 1;

        INounsAuctionHouseV2.Settlement[] memory settlements = auctionHouse.getSettlements(
            nextAuctionIdToReward_,
            lastNounId + 1,
            true
        );
        INounsAuctionHouseV2.Settlement memory lastSettlement = settlements[settlements.length - 1];
        if (!(lastSettlement.nounId == lastNounId && lastSettlement.blockTimestamp > 1))
            revert LastNounIdMustBeSettled();

        uint32 maxClientId = nextTokenId() - 1;
        ClientRewardsMemoryMapping.Mapping memory m = ClientRewardsMemoryMapping.createMapping({
            maxClientId: maxClientId
        });

        for (uint256 i; i < settlements.length; ++i) {
            INounsAuctionHouseV2.Settlement memory settlement = settlements[i];
            if (settlement.clientId != 0 && settlement.clientId <= maxClientId) {
                sawValidClientId = true;
                m.inc(settlement.clientId, settlement.amount);
            }
        }

        uint16 auctionRewardBps = $.auctionRewardParams.auctionRewardBps;
        uint256 numValues = m.numValues();
        for (uint32 i = 0; i < numValues; ++i) {
            ClientRewardsMemoryMapping.ClientBalance memory cb = m.getValue(i);
            uint256 reward = (cb.balance * auctionRewardBps) / 10_000;
            $._clientMetadata[cb.clientId].rewarded += SafeCast.toUint96(reward);

            emit ClientRewarded(cb.clientId, reward);
        }

        emit AuctionRewardsUpdated(nextAuctionIdToReward_, lastNounId);

        if (sawValidClientId) {
            // refund gas only if we're actually rewarding a client, not just moving the pointer
            GasRefund.refundGas($.ethToken, startGas);
        }
    }

    /// @dev struct used to avoid stack-too-deep errors
    struct Temp {
        uint32 maxClientId;
        uint256 numEligibleVotes;
        uint256 rewardPerProposal;
        uint256 rewardPerVote;
        uint256 proposalRewardForPeriod;
        uint256 votingRewardForPeriod;
        uint256 firstAuctionIdForRevenue;
        NounsDAOTypes.ProposalForRewards lastProposal;
    }

    /**
     * @notice Distribute rewards for proposal creation and voting from the last update until `lastProposalId`.
     * A proposal is eligible for rewards if it wasn't canceled and for-votes/total-votes >= params.proposalEligibilityQuorumBps.
     * Rewards are calculated by the auctions revenue during the period between the creation time of last processed
     * eligible proposal in until the current last eligible proposal with id <= `lastProposalId`.
     * One of two conditions must be true in order for rewards to be distributed:
     * 1. There are at least `numProposalsEnoughForReward` proposals in this update
     * 2. At least `minimumRewardPeriod` time has passed since the last update until the creation time of the last
     *     eligible proposal in this update.
     * Gas spent is refunded in `ethToken`.
     * @param lastProposalId id of the last proposal to include in the rewards distribution. all proposals up to and
     * including this id must have ended voting.
     * @param votingClientIds array of sorted client ids that were used to vote on the eligible proposals in
     * this rewards distribution. Reverts if it contains duplicates. Reverts if it's not sorted. Reverts if a clientId
     * had zero votes on all eligible proposals from this update.
     * You may use `getVotingClientIds` as a convenience function to get the correct `votingClientIds`.
     */
    function updateRewardsForProposalWritingAndVoting(
        uint32 lastProposalId,
        uint32[] calldata votingClientIds
    ) public whenNotPaused {
        uint256 startGas = gasleft();
        RewardsStorage storage $ = _getRewardsStorage();
        if (!$.proposalRewardsEnabled) revert RewardsDisabled();

        Temp memory t;

        t.maxClientId = nextTokenId() - 1;
        uint32 nextProposalIdToReward_ = $.nextProposalIdToReward;

        require(
            (lastProposalId <= nounsDAO.proposalCount()) && (lastProposalId >= nextProposalIdToReward_),
            'bad lastProposalId'
        );
        require(isSortedAndNoDuplicates(votingClientIds), 'must be sorted & unique');

        NounsDAOTypes.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards({
            firstProposalId: nextProposalIdToReward_,
            lastProposalId: lastProposalId,
            proposalEligibilityQuorumBps: $.proposalRewardParams.proposalEligibilityQuorumBps,
            excludeCanceled: true,
            requireVotingEnded: true,
            votingClientIds: votingClientIds
        });
        require(proposals.length > 0, 'at least one eligible proposal');
        $.nextProposalIdToReward = lastProposalId + 1;

        t.lastProposal = proposals[proposals.length - 1];

        t.firstAuctionIdForRevenue = $.nextProposalRewardFirstAuctionId;
        (uint256 auctionRevenue, uint256 lastAuctionIdForRevenue) = getAuctionRevenue({
            firstNounId: t.firstAuctionIdForRevenue,
            endTimestamp: t.lastProposal.creationTimestamp
        });
        $.nextProposalRewardFirstAuctionId = uint32(lastAuctionIdForRevenue) + 1;

        require(auctionRevenue > 0, 'auctionRevenue must be > 0');

        t.proposalRewardForPeriod = (auctionRevenue * $.proposalRewardParams.proposalRewardBps) / 10_000;
        t.votingRewardForPeriod = (auctionRevenue * $.proposalRewardParams.votingRewardBps) / 10_000;

        //// First loop over the proposals:
        //// 1. Count the number of votes in eligible proposals.

        for (uint256 i; i < proposals.length; ++i) {
            uint256 votesInProposal = proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes;
            t.numEligibleVotes += votesInProposal;
        }

        //// Check that distribution is allowed:
        //// 1. One of the two conditions must be true:
        //// 1.a. Number of eligible proposals is at least `numProposalsEnoughForReward`.
        //// 1.b. At least `minimumRewardPeriod` seconds have passed since the last update.

        if (proposals.length < $.proposalRewardParams.numProposalsEnoughForReward) {
            require(
                t.lastProposal.creationTimestamp >
                    $.lastProposalRewardsUpdate + $.proposalRewardParams.minimumRewardPeriod,
                'not enough time passed'
            );
        }
        $.lastProposalRewardsUpdate = uint40(t.lastProposal.creationTimestamp);

        // Calculate the reward per proposal and per vote
        t.rewardPerProposal = t.proposalRewardForPeriod / proposals.length;
        t.rewardPerVote = t.votingRewardForPeriod / t.numEligibleVotes;

        emit ProposalRewardsUpdated(
            nextProposalIdToReward_,
            lastProposalId,
            t.firstAuctionIdForRevenue,
            lastAuctionIdForRevenue,
            auctionRevenue,
            t.rewardPerProposal,
            t.rewardPerVote
        );

        //// Second loop over the proposals:
        //// 1. Reward proposal's clientId.
        //// 2. Reward the clientIds that faciliated voting.
        //// 3. Make sure all voting clientIds were included. This is meant to avoid griefing. Otherwises one could pass
        ////    a large array of votingClientIds, spend a lot of gas, and have that gas refunded.

        ClientRewardsMemoryMapping.Mapping memory m = ClientRewardsMemoryMapping.createMapping({
            maxClientId: t.maxClientId
        });
        bool[] memory didClientIdHaveVotes = new bool[](votingClientIds.length);

        for (uint256 i; i < proposals.length; ++i) {
            uint32 clientId = proposals[i].clientId;
            if (clientId != 0 && clientId <= t.maxClientId) {
                m.inc(clientId, t.rewardPerProposal);
            }

            uint256 votesInProposal;
            NounsDAOTypes.ClientVoteData[] memory voteData = proposals[i].voteData;
            for (uint256 j; j < votingClientIds.length; ++j) {
                clientId = votingClientIds[j];
                uint256 votes = voteData[j].votes;
                didClientIdHaveVotes[j] = didClientIdHaveVotes[j] || votes > 0;
                if (clientId != 0 && clientId <= t.maxClientId) {
                    m.inc(clientId, votes * t.rewardPerVote);
                }
                votesInProposal += votes;
            }
            require(
                votesInProposal == proposals[i].forVotes + proposals[i].againstVotes + proposals[i].abstainVotes,
                'not all votes accounted'
            );
        }

        for (uint256 i = 0; i < didClientIdHaveVotes.length; ++i) {
            require(didClientIdHaveVotes[i], 'all clientId must have votes');
        }

        uint256 numValues = m.numValues();
        for (uint32 i = 0; i < numValues; ++i) {
            ClientRewardsMemoryMapping.ClientBalance memory cb = m.getValue(i);
            $._clientMetadata[cb.clientId].rewarded += SafeCast.toUint96(cb.balance);
            emit ClientRewarded(cb.clientId, cb.balance);
        }

        GasRefund.refundGas($.ethToken, startGas);
    }

    /**
     * @notice Withdraws the balance of a client
     * @dev The caller must be the owner of the NFT with id `clientId` and the client must be approved by the DAO.
     * @param clientId Which client balance to withdraw
     * @param to the address to withdraw to
     * @param amount amount to withdraw
     */
    function withdrawClientBalance(uint32 clientId, address to, uint96 amount) public whenNotPaused {
        RewardsStorage storage $ = _getRewardsStorage();
        ClientMetadata storage md = $._clientMetadata[clientId];

        if (ownerOf(clientId) != msg.sender) revert OnlyNFTOwner();
        require(md.approved, 'not approved');

        uint96 withdrawnCache = md.withdrawn;
        require(amount <= md.rewarded - withdrawnCache, 'amount too large');

        md.withdrawn = withdrawnCache + amount;

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
     */
    function clientBalance(uint32 clientId) public view returns (uint96) {
        RewardsStorage storage $ = _getRewardsStorage();
        ClientMetadata storage md = $._clientMetadata[clientId];
        return md.rewarded - md.withdrawn;
    }

    /**
     * @notice Returns the clientIds that are needed to be passed as a parameter to updateRewardsForProposalWritingAndVoting
     * @dev This is not meant to be called onchain because it may be very gas intensive.
     */
    function getVotingClientIds(uint32 lastProposalId) public view returns (uint32[] memory) {
        RewardsStorage storage $ = _getRewardsStorage();

        uint256 numClientIds = nextTokenId();
        uint32[] memory allClientIds = new uint32[](numClientIds);
        for (uint32 i; i < numClientIds; ++i) {
            allClientIds[i] = i;
        }
        NounsDAOTypes.ProposalForRewards[] memory proposals = nounsDAO.proposalDataForRewards({
            firstProposalId: $.nextProposalIdToReward,
            lastProposalId: lastProposalId,
            proposalEligibilityQuorumBps: $.proposalRewardParams.proposalEligibilityQuorumBps,
            excludeCanceled: true,
            requireVotingEnded: true,
            votingClientIds: allClientIds
        });

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

    /**
     * @notice Returns the sum of revenue via auctions from auctioning noun with id `firstNounId` until timestamp of `endTimestamp
     */
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
        return _getRewardsStorage().nextAuctionIdToReward;
    }

    function nextProposalIdToReward() public view returns (uint32) {
        return _getRewardsStorage().nextProposalIdToReward;
    }

    function nextProposalRewardFirstAuctionId() public view returns (uint256) {
        return _getRewardsStorage().nextProposalRewardFirstAuctionId;
    }

    function lastProposalRewardsUpdate() public view returns (uint256) {
        return _getRewardsStorage().lastProposalRewardsUpdate;
    }

    function getAuctionRewardParams() public view returns (AuctionRewardParams memory) {
        return _getRewardsStorage().auctionRewardParams;
    }

    function getProposalRewardParams() public view returns (ProposalRewardParams memory) {
        return _getRewardsStorage().proposalRewardParams;
    }

    function auctionRewardsEnabled() public view returns (bool) {
        return _getRewardsStorage().auctionRewardsEnabled;
    }

    function proposalRewardsEnabled() public view returns (bool) {
        return _getRewardsStorage().proposalRewardsEnabled;
    }

    function ethToken() public view returns (IERC20) {
        return _getRewardsStorage().ethToken;
    }

    function admin() public view returns (address) {
        return _getRewardsStorage().admin;
    }

    /**
     * @notice Get the metadata of a client
     */
    function clientMetadata(uint32 tokenId) public view returns (ClientMetadata memory) {
        return _getRewardsStorage()._clientMetadata[tokenId];
    }

    /**
     * @notice Get the URI of a client token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        RewardsStorage storage $ = _getRewardsStorage();
        return INounsClientTokenDescriptor($.descriptor).tokenURI(tokenId, $._clientMetadata[uint32(tokenId)]);
    }

    /**
     * @notice Get the descriptor for the client token
     */
    function descriptor() public view returns (address) {
        return _getRewardsStorage().descriptor;
    }

    /**
     * @notice Get the next token ID
     */
    function nextTokenId() public view returns (uint32) {
        return _getRewardsStorage().nextTokenId;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Set whether the client is approved to withdraw their reward balance.
     * Anyone can mint a client NFT and start earning rewards, but only approved clients can withdraw.
     * This way the DAO helps mitigate abuse.
     * @dev Only `owner` can call this function
     */
    function setClientApproval(uint32 clientId, bool approved) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $._clientMetadata[clientId].approved = approved;
        emit ClientApprovalSet(clientId, approved);
    }

    /**
     * @notice Updates the auction rewards params
     * @dev Only `owner` can call this function
     */
    function setAuctionRewardParams(AuctionRewardParams calldata newParams) public onlyOwner {
        _getRewardsStorage().auctionRewardParams = newParams;
    }

    /**
     * @notice Enables auction rewards and sets the next auction id to reward to be the current noun on auction
     * @dev Only `owner` can call this function
     */
    function enableAuctionRewards() public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        uint32 nextAuctionIdToReward_ = SafeCast.toUint32(auctionHouse.auction().nounId);
        $.nextAuctionIdToReward = nextAuctionIdToReward_;
        $.auctionRewardsEnabled = true;

        emit AuctionRewardsEnabled(nextAuctionIdToReward_);
    }

    /**
     * @notice Disables auction rewards
     * @dev Only `owner` can call this function
     */
    function disableAuctionRewards() public onlyOwner {
        _getRewardsStorage().auctionRewardsEnabled = false;

        emit AuctionRewardsDisabled();
    }

    /**
     * @notice Updates the proposal rewards params
     * @dev Only `owner` can call this function
     */
    function setProposalRewardParams(ProposalRewardParams calldata newParams) public onlyOwner {
        _getRewardsStorage().proposalRewardParams = newParams;
    }

    /**
     * @notice Enables proposal rewards and sets the next proposal ID to reward to be the next proposal to be created.
     * The first auction ID to be considered for revenue calculation is set to be the current noun in auction.
     * @dev Only `owner` can call this function
     */
    function enableProposalRewards() public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        uint32 nextProposalIdToReward_ = SafeCast.toUint32(nounsDAO.proposalCount() + 1);
        uint32 nextProposalRewardFirstAuctionId_ = SafeCast.toUint32(auctionHouse.auction().nounId);
        $.nextProposalIdToReward = nextProposalIdToReward_;
        $.nextProposalRewardFirstAuctionId = nextProposalRewardFirstAuctionId_;
        $.lastProposalRewardsUpdate = uint40(block.timestamp);
        $.proposalRewardsEnabled = true;

        emit ProposalRewardsEnabled(nextProposalIdToReward_, nextProposalRewardFirstAuctionId_);
    }

    /**
     * @notice Disables proposal rewards
     * @dev Only `owner` can call this function
     */
    function disableProposalRewards() public onlyOwner {
        _getRewardsStorage().proposalRewardsEnabled = false;

        emit ProposalRewardsDisabled();
    }

    /**
     * @dev Only `owner` can call this function
     */
    function setAdmin(address newAdmin) public onlyOwner {
        _getRewardsStorage().admin = newAdmin;
    }

    /**
     * @dev Only `owner` can call this function
     */
    function setETHToken(address newToken) public onlyOwner {
        _getRewardsStorage().ethToken = IERC20(newToken);
    }

    /**
     * @notice Withdraws any ERC20 token held by the contract
     * @param token Address of ERC20 token
     * @param to Address to send tokens to
     * @param amount Amount of tokens to withdraw
     * @dev Only `owner` can call this function
     */
    function withdrawToken(address token, address to, uint256 amount) public onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @notice Pauses reward distributes, client registration and withdrawals
     * @dev Only `owner` or `admin` can call this function
     */
    function pause() public onlyOwnerOrAdmin {
        _pause();
    }

    /**
     * @notice Unpauses reward distributes, client registration and withdrawals
     * @dev Only `owner` or `admin` can call this function
     */
    function unpause() public onlyOwnerOrAdmin {
        _unpause();
    }

    /**
     * @notice Set the descriptor for the client token
     * @dev Only `owner` or `admin` can call this function
     */
    function setDescriptor(address descriptor_) public onlyOwnerOrAdmin {
        _getRewardsStorage().descriptor = descriptor_;
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

    /**
     * Only `owner` can perform an upgrade
     */
    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
