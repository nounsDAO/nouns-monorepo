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
    error RocketETHConversionRateTooLow();

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

    function excessETH() public view returns (uint256) {
        if (block.timestamp < waitingPeriodEnd) return 0;

        uint256 expectedTreasuryValue = expectedTreasuryValueInETH();
        uint256 treasuryValue = treasuryValueInETH();

        if (expectedTreasuryValue >= treasuryValue) return 0;

        return min(treasuryValue - expectedTreasuryValue, owner().balance);
    }

    function expectedTreasuryValueInETH() public view returns (uint256) {
        return meanAuctionPrice() * dao.adjustedTotalSupply();
    }

    function treasuryValueInETH() public view returns (uint256) {
        address owner_ = owner();
        return owner_.balance + stETH.balanceOf(owner_) + wETH.balanceOf(owner_) + rETHBalanceInETH();
    }

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

    function rETHBalanceInETH() public view returns (uint256) {
        return RocketETH(address(rETH)).getEthValue(rETH.balanceOf(owner()));
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   OWNER FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function setNumberOfPastAuctionsForMeanPrice(uint16 newNumberOfPastAuctionsForMeanPrice) external onlyOwner {
        emit NumberOfPastAuctionsForMeanPriceSet(numberOfPastAuctionsForMeanPrice, newNumberOfPastAuctionsForMeanPrice);

        numberOfPastAuctionsForMeanPrice = newNumberOfPastAuctionsForMeanPrice;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
