// SPDX-License-Identifier: GPL-3.0

/**
 *
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
 *
 */

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INounsAuctionHouseV2 } from '../interfaces/INounsAuctionHouseV2.sol';

interface RocketETH {
    function getEthValue(uint256 _rethAmount) external view returns (uint256);
}

interface INounsDAOV3 {
    function adjustedTotalSupply() external view returns (uint256);
}

interface IExecutorV3 {
    function burnExcessETH(uint256 amount) external;
}

/**
 * @title ExcessETH Burner
 * @notice A helper contract for burning Nouns excess ETH with NounsDAOExecutorV3.
 * @dev Owner is assumed to be the NounsDAOExecutorV3 contract, i.e. the Nouns treasury.
 */
contract ExcessETHBurner is Ownable {
    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ERRORS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    error NotTimeToBurnYet();
    error NoExcessToBurn();
    error NotEnoughAuctionHistory();
    error PastAuctionCountTooLow();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   EVENTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    event AuctionSet(address oldAuction, address newAuction);
    event InitialBurnNounIdSet(uint128 initialBurnNounId, uint128 newInitialBurnNounId);
    event NounIdsBetweenBurnsSet(uint128 nounIdsBetweenBurns, uint128 newNounIdsBetweenBurns);
    event BurnWindowSizeSet(uint16 burnWindowSize, uint16 newBurnWindowSize);
    event NumberOfPastAuctionsForMeanPriceSet(
        uint16 oldNumberOfPastAuctionsForMeanPrice,
        uint16 newNumberOfPastAuctionsForMeanPrice
    );
    event Burn(uint256 amount, uint128 currentBurnWindowStart, uint128 currentNounId, uint128 newInitialBurnNounId);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    uint256 public constant MIN_PAST_AUCTIONS = 2;

    INounsDAOV3 public immutable dao;
    INounsAuctionHouseV2 public immutable auction;
    IERC20 public immutable wETH;
    IERC20 public immutable stETH;
    IERC20 public immutable rETH;
    uint64 public initialBurnNounId;
    uint64 public nounIdsBetweenBurns;
    uint16 public burnWindowSize;
    uint16 public numberOfPastAuctionsForMeanPrice;

    /**
     * @param owner_ A NounsDAOExecutorV3 instance
     * @param dao_ The DAO proxy contract
     * @param auction_ The Auction House proxy contract
     * @param wETH_ Address of WETH token
     * @param stETH_ Address of Lido stETH token
     * @param rETH_ Address of RocketPool RETH token
     * @param initialBurnNounId_ The lowest noun id at which a burn can be triggered
     * @param nounIdsBetweenBurns_ Number of nouns that need to be minted between burn windows
     * @param burnWindowSize_ Number of nouns in a burn window
     * @param numberOfPastAuctionsForMeanPrice_ Number of past auctions to consider when calculating mean price
     */
    constructor(
        address owner_,
        INounsDAOV3 dao_,
        INounsAuctionHouseV2 auction_,
        IERC20 wETH_,
        IERC20 stETH_,
        IERC20 rETH_,
        uint64 initialBurnNounId_,
        uint64 nounIdsBetweenBurns_,
        uint16 burnWindowSize_,
        uint16 numberOfPastAuctionsForMeanPrice_
    ) {
        _transferOwnership(owner_);

        dao = dao_;
        auction = auction_;
        wETH = wETH_;
        stETH = stETH_;
        rETH = rETH_;
        initialBurnNounId = initialBurnNounId_;
        nounIdsBetweenBurns = nounIdsBetweenBurns_;
        burnWindowSize = burnWindowSize_;
        numberOfPastAuctionsForMeanPrice = numberOfPastAuctionsForMeanPrice_;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Burn excess ETH in the Nouns treasury.
     * Allows the burn to occur every `minNewNounsBetweenBurns` new Nouns minted.
     * For example, if `minNewNounsBetweenBurns` is 100, and the first `nextBurnNounID` is 1000, then the following
     * Nouns IDs are allowed to burn excess ETH: 1100, 1200, 1300, etc.
     *
     * See `excessETH()` for more information on how excess ETH is defined.
     * @dev Reverts when auction house has not yet minted the next Noun ID at which the burn is allowed.
     */
    function burnExcessETH() public returns (uint256 amount) {
        uint128 currentNounId = currentlyAuctionedNounId();

        // Make sure this is a valid noun id. This will revert if this id doesn't exist
        auction.nouns().ownerOf(currentNounId);

        uint64 nounIdsBetweenBurns_ = nounIdsBetweenBurns;
        uint64 initialBurnNounId_ = initialBurnNounId;
        if (!isInBurnWindow(currentNounId, initialBurnNounId_, nounIdsBetweenBurns_)) revert NotTimeToBurnYet();
        uint64 newInitialBurnNounId = nextBurnWindowStart(
            uint64(currentNounId),
            initialBurnNounId_,
            nounIdsBetweenBurns_
        );
        initialBurnNounId = newInitialBurnNounId;

        amount = excessETH();
        if (amount == 0) revert NoExcessToBurn();

        IExecutorV3(owner()).burnExcessETH(amount);

        emit Burn(amount, newInitialBurnNounId - nounIdsBetweenBurns_, currentNounId, newInitialBurnNounId);
    }

    /**
     * @notice Returns the id of the noun currently being auctioned
     */
    function currentlyAuctionedNounId() public view returns (uint128) {
        return auction.auction().nounId;
    }

    /**
     * @notice Returns true if `nounId` is within a burn window.
     * A burn window can start at `initialBurnNounId_` + N * `nounIdsBetweenBurns_` for any N >= 0.
     * The window size is defined by `burnWindowSize`.
     */
    function isInBurnWindow(
        uint256 nounId,
        uint64 initialBurnNounId_,
        uint64 nounIdsBetweenBurns_
    ) public view returns (bool) {
        if (nounId < initialBurnNounId_) return false;

        uint256 distanceFromBurnWindowStart = (nounId - initialBurnNounId_) % nounIdsBetweenBurns_;

        return distanceFromBurnWindowStart <= burnWindowSize;
    }

    /**
     * @notice Returns the next burn window start id.
     * For a given `currentNounId`, it returns the next id which can be represented by
     * `initialBurnNounId_` + N * `nounIdsBetweenBurns_` for any N >= 0.
     */
    function nextBurnWindowStart(
        uint64 currentNounId,
        uint64 initialBurnNounId_,
        uint64 nounIdsBetweenBurns_
    ) public pure returns (uint64) {
        // this could not happen during a burn. here as convenience.
        if (currentNounId < initialBurnNounId_) return initialBurnNounId_;

        uint64 distanceFromBurnWindowStart = (currentNounId - initialBurnNounId_) % nounIdsBetweenBurns_;
        return currentNounId - distanceFromBurnWindowStart + nounIdsBetweenBurns_;
    }

    /**
     * @notice Get the amount of excess ETH in the Nouns treasury.
     * Excess ETH is defined as the difference between the current treasury value denominated in ETH,
     * and the expected treasury value denominated in ETH, which is defined as mean auction price * adjusted total supply.
     * It returns zero during the waiting period, and when expected treasury value is greater than current value.
     * If treasury balance in native ETH is less than the excess ETH calculation, it returns the treasury ETH balance.
     * @dev This version does not support burning excess other than in native ETH, e.g. stETH, rETH, etc.
     * @dev Reverts if there is not enough auction history to calculate the mean auction price.
     */
    function excessETH() public view returns (uint256) {
        uint256 expectedTreasuryValue = expectedTreasuryValueInETH();
        uint256 treasuryValue = treasuryValueInETH();

        if (expectedTreasuryValue >= treasuryValue) return 0;

        return min(treasuryValue - expectedTreasuryValue, owner().balance);
    }

    /**
     * @notice Get the expected treasury value denomiated in ETH.
     * Expected value is defined as mean auction price * adjusted total supply.
     */
    function expectedTreasuryValueInETH() public view returns (uint256) {
        return meanAuctionPrice() * dao.adjustedTotalSupply();
    }

    /**
     * @notice Get the current treasury value denomiated in ETH.
     * In addition to native ETH, it also includes stETH, wETH, and rETH balances.
     * @dev for rETH, it uses the getEthValue() function to convert rETH to ETH.
     */
    function treasuryValueInETH() public view returns (uint256) {
        address owner_ = owner();
        return owner_.balance + stETH.balanceOf(owner_) + wETH.balanceOf(owner_) + rETHBalanceInETH(owner_);
    }

    /**
     * @notice Get the mean auction price of the last `numberOfPastAuctionsForMeanPrice` auctions.
     * @dev Reverts if there is not enough auction history to calculate the mean auction price.
     */
    function meanAuctionPrice() public view returns (uint256) {
        uint16 numberOfPastAuctionsForMeanPrice_ = numberOfPastAuctionsForMeanPrice;
        uint256[] memory prices = auction.getPrices(numberOfPastAuctionsForMeanPrice_);

        if (prices.length < numberOfPastAuctionsForMeanPrice_) revert NotEnoughAuctionHistory();

        uint256 sum = 0;
        for (uint16 i = 0; i < numberOfPastAuctionsForMeanPrice_; i++) {
            sum += prices[i];
        }

        return sum / numberOfPastAuctionsForMeanPrice_;
    }

    /**
     * @notice Get an account's rETH balance, denominated in ETH.
     * @param account the account to get the rETH balance of.
     */
    function rETHBalanceInETH(address account) public view returns (uint256) {
        return RocketETH(address(rETH)).getEthValue(rETH.balanceOf(account));
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   OWNER FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Sets `initialBurnNounId`
     * Can only be called by owner, which is assumed to be the NounsDAOExecutorV3 contract, i.e. the Nouns treasury.
     */
    function setInitialBurnNounId(uint64 newInitialBurnNounId) external onlyOwner {
        emit InitialBurnNounIdSet(initialBurnNounId, newInitialBurnNounId);

        initialBurnNounId = newInitialBurnNounId;
    }

    /**
     * @notice Sets `nounIdsBetweenBurns`
     * Can only be called by owner, which is assumed to be the NounsDAOExecutorV3 contract, i.e. the Nouns treasury.
     */
    function setNounIdsBetweenBurns(uint64 newNounIdsBetweenBurns) external onlyOwner {
        emit NounIdsBetweenBurnsSet(nounIdsBetweenBurns, newNounIdsBetweenBurns);

        nounIdsBetweenBurns = newNounIdsBetweenBurns;
    }

    function setBurnWindowSize(uint16 newBurnWindowSize) external onlyOwner {
        emit BurnWindowSizeSet(burnWindowSize, newBurnWindowSize);

        burnWindowSize = newBurnWindowSize;
    }

    /**
     * @notice Set the number of past auctions to use for calculating the mean auction price.
     * Can only be called by owner, which is assumed to be the NounsDAOExecutorV3 contract, i.e. the Nouns treasury.
     * @param newNumberOfPastAuctionsForMeanPrice The new number of past auctions to use for calculating the mean auction price.
     */
    function setNumberOfPastAuctionsForMeanPrice(uint16 newNumberOfPastAuctionsForMeanPrice) external onlyOwner {
        if (newNumberOfPastAuctionsForMeanPrice < MIN_PAST_AUCTIONS) revert PastAuctionCountTooLow();

        emit NumberOfPastAuctionsForMeanPriceSet(numberOfPastAuctionsForMeanPrice, newNumberOfPastAuctionsForMeanPrice);

        numberOfPastAuctionsForMeanPrice = newNumberOfPastAuctionsForMeanPrice;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @dev A helper function to return the minimum of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
