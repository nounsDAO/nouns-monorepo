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
import { InMemoryMapping } from '../libs/InMemoryMapping.sol';
import { GasRefund } from '../libs/GasRefund.sol';
import { INounsClientTokenDescriptor } from './INounsClientTokenDescriptor.sol';
import { INounsClientTokenTypes } from './INounsClientTokenTypes.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { ERC721Upgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';

contract Rewards is
    UUPSUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    INounsClientTokenTypes
{
    using SafeERC20 for IERC20;
    using InMemoryMapping for InMemoryMapping.Mapping;

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
        uint256 auctionRevenue,
        uint256 rewardPerProposal,
        uint256 rewardPerVote
    );
    event ClientApprovalSet(uint32 indexed clientId, bool approved);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   IMMUTABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    INounsDAOLogic public immutable nounsDAO;

    INounsAuctionHouseV2 public immutable auctionHouse;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STORAGE VARIABLES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    struct RewardParams {
        /// @dev Used for proposal rewards
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
        /// @dev Used for auction rewards
        /// @dev How much bips out of auction revnue to use for rewarding auction bidding
        uint16 auctionRewardBps;
        /// @dev Minimum number of auctions between updates. Zero means 1 auction is enough.
        uint8 minimumAuctionsBetweenUpdates;
    }

    /// @custom:storage-location erc7201:nouns.rewards
    struct RewardsStorage {
        /// @dev The next client token id to be minted
        uint32 nextTokenId;
        /// @dev Used for auction rewards state
        uint32 nextAuctionIdToReward;
        /// @dev Used for proposal rewards state
        uint32 nextProposalIdToReward;
        /// @dev The first auction id to consider for revenue tracking on the next proposal rewards update
        uint32 nextProposalRewardFirstAuctionId;
        /// @dev Last time the proposal rewards update was performed
        uint40 lastProposalRewardsUpdate;
        /// @dev Params for both auction & rewards
        RewardParams params;
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
        nounsDAO = INounsDAOLogic(nounsDAO_);
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
        address descriptor_
    ) public initializer {
        __Pausable_init_unchained();
        __ERC721_init('Nouns Client Token', 'NOUNSCLIENT');

        RewardsStorage storage $ = _getRewardsStorage();
        $.nextTokenId = 1;
        $.lastProposalRewardsUpdate = uint40(block.timestamp);

        _transferOwnership(owner);
        $.admin = admin_;
        $.ethToken = IERC20(ethToken_);
        $.nextProposalIdToReward = nextProposalIdToReward_;
        $.nextAuctionIdToReward = nextAuctionIdToReward_;
        $.nextProposalRewardFirstAuctionId = nextProposalRewardFirstAuctionId_;
        $.params = rewardParams;
        $.descriptor = descriptor_;
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

        require(ownerOf(tokenId) == msg.sender, 'NounsClientToken: not owner');
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
     * @param lastNounId the last auction id to reward client for. must be already settled.
     * @dev Gas is refunded if at least one auction was rewarded
     */
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
            $._clientMetadata[cb.clientId].rewarded += toUint104(reward);

            emit ClientRewarded(cb.clientId, reward);
        }

        emit AuctionRewardsUpdated(nextAuctionIdToReward_, lastNounId);

        if (sawNonZeroClientId) {
            // refund gas only if we're actually rewarding a client, not just moving the pointer
            GasRefund.refundGas($.ethToken, startGas);
        }
    }

    /// @dev struct used to avoid stack-too-deep errors
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
     * @notice Distribute rewards for proposal creation and voting from the last update until `lastProposalId`.
     * A proposal is eligible for rewards if for-votes/total-votes >= params.proposalEligibilityQuorumBps.
     * Rewards are calculated by the auctions revenue during the period between the creation time of last proposal in
     * the previous update until the current last proposal with id `lastProposalId`.
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

        emit ProposalRewardsUpdated(
            t.nextProposalIdToReward,
            lastProposalId,
            auctionRevenue,
            t.rewardPerProposal,
            t.rewardPerVote
        );

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
            $._clientMetadata[cb.clientId].rewarded += toUint104(cb.balance);
            emit ClientRewarded(cb.clientId, cb.balance);
        }

        GasRefund.refundGas($.ethToken, startGas);
    }

    /**
     * @notice Withdraws the balance of a client
     * @dev The caller must be the owner of the NFT with id `clientId`
     * @param clientId Which client balance to withdraw
     * @param to the address to withdraw to
     * @param amount amount to withdraw
     */
    function withdrawClientBalance(uint32 clientId, address to, uint104 amount) public whenNotPaused {
        RewardsStorage storage $ = _getRewardsStorage();
        ClientMetadata storage md = $._clientMetadata[clientId];

        require(ownerOf(clientId) == msg.sender, 'must be client NFT owner');
        require(md.approved, 'client not approved');

        uint104 withdrawnCache = md.withdrawn;
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
    function clientBalance(uint32 clientId) public view returns (uint104) {
        RewardsStorage storage $ = _getRewardsStorage();
        ClientMetadata storage md = $._clientMetadata[clientId];
        return md.rewarded - md.withdrawn;
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

    /**
     * Returns the sum of revenue via auctions from auctioning noun with id `firstNounId` until timestamp of `endTimestamp
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
     * @notice Get the metadata of a client
     */
    function clientMetadata(uint32 tokenId) public view returns (ClientMetadata memory) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $._clientMetadata[tokenId];
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
        RewardsStorage storage $ = _getRewardsStorage();
        return $.descriptor;
    }

    /**
     * @notice Get the next token ID
     */
    function nextTokenId() public view returns (uint32) {
        RewardsStorage storage $ = _getRewardsStorage();
        return $.nextTokenId;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @dev Only `owner` can call this function
     */
    function setClientApproval(uint32 clientId, bool approved) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $._clientMetadata[clientId].approved = approved;
        emit ClientApprovalSet(clientId, approved);
    }

    /**
     * @dev Only `owner` can call this function
     */
    function setParams(RewardParams calldata newParams) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.params = newParams;
    }

    /**
     * @dev Only `owner` can call this function
     */
    function setAdmin(address newAdmin) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.admin = newAdmin;
    }

    /**
     * @dev Only `owner` can call this function
     */
    function setETHToken(address newToken) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.ethToken = IERC20(newToken);
    }

    /**
     * @dev Only `owner` can call this function
     */
    function withdrawToken(address token, address to, uint256 amount) public onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @dev Only `owner` or `admin` can call this function
     */
    function pause() public onlyOwnerOrAdmin {
        _pause();
    }

    /**
     * @dev Only `owner` or `admin` can call this function
     */
    function unpause() public onlyOwnerOrAdmin {
        _unpause();
    }

    /**
     * @notice Set the descriptor for the client token
     */
    function setDescriptor(address descriptor_) public onlyOwner {
        RewardsStorage storage $ = _getRewardsStorage();
        $.descriptor = descriptor_;
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

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
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

    function toUint104(uint256 value) internal pure returns (uint104) {
        require(value <= type(uint104).max, "value doesn't fit in 104 bits");
        return uint104(value);
    }

    /**
     * Only `owner` can perform an upgrade
     */
    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
