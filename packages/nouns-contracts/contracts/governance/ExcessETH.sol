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

import { IExcessETH } from '../interfaces/IExcessETH.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INounsAuctionHouse } from '../interfaces/INounsAuctionHouse.sol';

interface RocketETH {
    function getEthValue(uint256 _rethAmount) external view returns (uint256);
}

interface INounsDAOV3 {
    function adjustedTotalSupply() external view returns (uint256);
}

interface INounsAuctionHouseV2 is INounsAuctionHouse {
    function prices(uint256 auctionCount) external view returns (Settlement[] memory settlements);
}

/**
 * @title ExcessETH Helper
 * @notice A helpder contract for calculating Nouns excess ETH, used by NounsDAOExecutorV3 to burn excess ETH.
 * @dev Owner is assumed to be the NounsDAOExecutorV3 contract, i.e. the Nouns treasury.
 */
contract ExcessETH is IExcessETH, Ownable {
    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ERRORS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    error NotEnoughAuctionHistory();
    error PastAuctionCountTooLow();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   EVENTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    event AuctionSet(address oldAuction, address newAuction);
    event NumberOfPastAuctionsForMeanPriceSet(
        uint16 oldNumberOfPastAuctionsForMeanPrice,
        uint16 newNumberOfPastAuctionsForMeanPrice
    );

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
    uint256 public immutable waitingPeriodEnd;
    uint16 public numberOfPastAuctionsForMeanPrice;

    constructor(
        address owner_,
        INounsDAOV3 dao_,
        INounsAuctionHouseV2 auction_,
        IERC20 wETH_,
        IERC20 stETH_,
        IERC20 rETH_,
        uint256 waitingPeriodEnd_,
        uint16 numberOfPastAuctionsForMeanPrice_
    ) {
        _transferOwnership(owner_);

        dao = dao_;
        auction = auction_;
        wETH = wETH_;
        stETH = stETH_;
        rETH = rETH_;
        waitingPeriodEnd = waitingPeriodEnd_;
        numberOfPastAuctionsForMeanPrice = numberOfPastAuctionsForMeanPrice_;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

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
        if (block.timestamp < waitingPeriodEnd) return 0;

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
        INounsAuctionHouseV2.Settlement[] memory settlements = auction.prices(numberOfPastAuctionsForMeanPrice_);

        if (settlements.length < numberOfPastAuctionsForMeanPrice_) revert NotEnoughAuctionHistory();

        uint256 sum = 0;
        for (uint16 i = 0; i < numberOfPastAuctionsForMeanPrice_; i++) {
            sum += settlements[i].amount;
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
