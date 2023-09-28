// SPDX-License-Identifier: GPL-3.0

/// @title A helpder contract for calculating Nouns excess ETH

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
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol';
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

contract ExcessETH is IExcessETH, OwnableUpgradeable, UUPSUpgradeable {
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

    INounsDAOV3 public dao;
    INounsAuctionHouseV2 public auction;
    uint16 public numberOfPastAuctionsForMeanPrice;
    IERC20 public wETH;
    IERC20 public stETH;
    IERC20 public rETH;

    function initialize(
        address owner_,
        INounsDAOV3 dao_,
        INounsAuctionHouseV2 auction_,
        uint16 numberOfPastAuctionsForMeanPrice_,
        IERC20 wETH_,
        IERC20 stETH_,
        IERC20 rETH_
    ) external initializer {
        _transferOwnership(owner_);

        dao = dao_;
        auction = auction_;
        numberOfPastAuctionsForMeanPrice = numberOfPastAuctionsForMeanPrice_;
        wETH = wETH_;
        stETH = stETH_;
        rETH = rETH_;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function excessETH() public view returns (uint256) {
        uint256 expectedTreasuryValue = meanAuctionPrice() * dao.adjustedTotalSupply();
        return min(treasuryValueInETH() - expectedTreasuryValue, owner().balance);
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

    function treasuryValueInETH() public view returns (uint256) {
        address owner_ = owner();
        return owner_.balance + stETH.balanceOf(owner_) + wETH.balanceOf(owner_) + rETHBalanceInETH();
    }

    function rETHBalanceInETH() public view returns (uint256) {
        return RocketETH(address(rETH)).getEthValue(rETH.balanceOf(owner()));
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   OWNER FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function setAuction(INounsAuctionHouseV2 newAuction) public onlyOwner {
        emit AuctionSet(address(auction), address(newAuction));

        auction = newAuction;
    }

    function setNumberOfPastAuctionsForMeanPrice(uint16 newNumberOfPastAuctionsForMeanPrice) public onlyOwner {
        emit NumberOfPastAuctionsForMeanPriceSet(numberOfPastAuctionsForMeanPrice, newNumberOfPastAuctionsForMeanPrice);

        numberOfPastAuctionsForMeanPrice = newNumberOfPastAuctionsForMeanPrice;
    }

    function setWETH(IERC20 newWETH) public onlyOwner {
        wETH = newWETH;
    }

    function setSTETH(IERC20 newSTETH) public onlyOwner {
        stETH = newSTETH;
    }

    function setRETH(IERC20 newRETH) public onlyOwner {
        rETH = newRETH;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @dev Reverts when `msg.sender` is not the owner of this contract; in the case of Noun DAOs it should be the
     * DAO's treasury contract.
     */
    function _authorizeUpgrade(address) internal view override onlyOwner {}

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
