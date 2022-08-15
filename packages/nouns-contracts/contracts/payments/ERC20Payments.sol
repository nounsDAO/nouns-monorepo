// SPDX-License-Identifier: GPL-3.0

/// @title ERC20 Token Payments

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

pragma solidity ^0.8.6;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IPriceFeed } from './IPriceFeed.sol';
import { IOUToken } from './IOUToken.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

contract ERC20Payments is Ownable {
    error FailedSendingETH(bytes data);
    error TokenAmountTooHigh(uint256 amount, uint256 amountNeeded);
    error FailedWithdrawingETH(bytes data);

    uint8 public constant WAD_DECIMALS = 18;

    /// @notice the ERC20 token the owner of this contract wishes to perform payments in.
    IERC20 public immutable paymentToken;

    /// @notice the number of decimals `paymentToken` has.
    uint8 public immutable paymentTokenDecimals;

    /// @notice the ERC20 token that represents this contracts liabilities in `paymentToken`. Assumed to have 18 decimals.
    IOUToken public immutable iouToken;

    /// @notice the contract used to fetch the price of `paymentToken` in ETH.
    IPriceFeed public priceFeed;

    /// @notice the minimum `paymentToken` balance this contract should aim to hold, in WAD format.
    uint256 public baselinePaymentTokenAmount;

    /// @notice the amount of basis points to increase `paymentToken` price by, to increase the incentive to transact with this contract.
    uint16 public botIncentiveBPs;

    constructor(
        IERC20 _paymentToken,
        uint8 _paymentTokenDecimals,
        IOUToken _iouToken,
        IPriceFeed _priceFeed,
        uint256 _baselinePaymentTokenAmount,
        uint16 _botIncentiveBPs,
        address _owner
    ) {
        paymentToken = _paymentToken;
        paymentTokenDecimals = _paymentTokenDecimals;
        iouToken = _iouToken;

        priceFeed = _priceFeed;
        baselinePaymentTokenAmount = _baselinePaymentTokenAmount;
        botIncentiveBPs = _botIncentiveBPs;
        _transferOwnership(_owner);
    }

    /**
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      EXTERNAL TRANSACTIONS
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Buy ETH from this contract in exchange for the ERC20 this token wants to acquire. The price
     * is determined using `priceFeed` plus `botIncentiveBPs` basis points.
     * @dev reverts when `tokenAmount > tokenAmountNeeded()`.
     * @param tokenAmount the amount of ERC20 tokens msg.sender wishes to sell to this contract in exchange for ETH, using
     * the same decimals as `paymentToken`.
     */
    function buyETH(uint256 tokenAmount) external payable {
        // TODO protect from reentrance

        uint256 tokenAmountWAD = toWAD(tokenAmount, paymentTokenDecimals);
        if (tokenAmountWAD > tokenAmountNeeded()) {
            revert TokenAmountTooHigh(tokenAmountWAD, tokenAmountNeeded());
        }

        paymentToken.transferFrom(msg.sender, address(this), tokenAmount);

        uint256 ethAmount = ethAmountPerTokenAmount(tokenAmountWAD);
        (bool sent, bytes memory data) = msg.sender.call{ value: ethAmount }('');
        if (!sent) {
            revert FailedSendingETH(data);
        }
    }

    /**
     * @notice Redeem `account`'s IOU tokens in exchange for `paymentToken` in a best-effort approach, meaning it will
     * attempt to redeem as much as possible up to `account`'s IOU balance, without reverting even if the amount is zero.
     * Any account can redeem on behalf of `account`.
     * @dev this function burns the IOU token balance that gets exchanged for `paymentToken`.
     * @param account the account whose IOU tokens to redeem in exchange for `paymentToken`s.
     */
    function redeem(address account) external {
        uint256 amount = min(iouToken.balanceOf(account), paymentTokenBalance());
        _redeem(account, amount);
    }

    function redeem(address account, uint256 amount) external {
        amount = min(amount, iouToken.balanceOf(account));
        amount = min(amount, paymentTokenBalance());
        _redeem(account, amount);
    }

    /**
     * @notice Allow ETH top-ups outside the `sendOrMint`, e.g. if the DAO wishes to increase `baselinePaymentTokenAmount`
     * and immediately provide sufficient ETH to acquire the additional tokens.
     */
    receive() external payable {}

    /**
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      VIEW FUNCTIONS
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @return uint256 the amount of `paymentToken` this contract is willing to buy in exchange for ETH, in WAD format.
     */
    function tokenAmountNeeded() public view returns (uint256) {
        return baselinePaymentTokenAmount + iouToken.totalSupply() - paymentTokenBalance();
    }

    /**
     * @notice Get how much ETH this contract needs in order to fund its current obligations plus `additionalTokens`, with
     * a safety buffer `bufferBPs` basis points.
     * @param additionalTokens an additional amount of `paymentToken` liability to use in this ETH requirement calculation,
     * in WAD format.
     * @param bufferBPs the number of basis points to add on top of the token liability price in ETH as a safety buffer, e.g.
     * if `bufferBPs` is 10K, the function will return twice the amount it needs according to price alone.
     * @return uint256 the amount of ETH needed to fund `additionalTokens` with a `bufferBPs` safety buffer.
     */
    function ethNeeded(uint256 additionalTokens, uint256 bufferBPs) public view returns (uint256) {
        uint256 tokenAmount = tokenAmountNeeded() + additionalTokens;
        uint256 ethCostOfTokens = ethAmountPerTokenAmount(tokenAmount);
        uint256 ethCostWithBuffer = (ethCostOfTokens * (bufferBPs + 10_000)) / 10_000;

        return ethCostWithBuffer - address(this).balance;
    }

    function price() public view returns (uint256, uint8) {
        (uint256 tokenPrice, uint8 priceDecimals) = priceFeed.price();
        tokenPrice = (tokenPrice * (botIncentiveBPs + 10_000)) / 10_000;
        return (tokenPrice, priceDecimals);
    }

    function paymentTokenBalance() internal view returns (uint256) {
        return toWAD(paymentToken.balanceOf(address(this)), paymentTokenDecimals);
    }

    /**
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      OWNER TRANSACTIONS
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @param account the account to send or mint to.
     * @param amountWAD the amount of tokens `account` should receive, in WAD format.
     */
    function sendOrMint(address account, uint256 amountWAD) external payable onlyOwner {
        uint256 paymentTokenBalanceWAD = paymentTokenBalance();

        if (amountWAD <= paymentTokenBalanceWAD) {
            paymentToken.transfer(account, wadToTokenDecimals(amountWAD));
        } else if (paymentTokenBalanceWAD > 0) {
            paymentToken.transfer(account, wadToTokenDecimals(paymentTokenBalanceWAD));
            iouToken.mint(account, amountWAD - paymentTokenBalanceWAD);
        } else {
            iouToken.mint(account, amountWAD);
        }
    }

    function withdrawETH() external onlyOwner {
        (bool sent, bytes memory data) = owner().call{ value: address(this).balance }('');
        if (!sent) {
            revert FailedWithdrawingETH(data);
        }
    }

    function withdrawPaymentToken() external onlyOwner {
        paymentToken.transfer(owner(), paymentToken.balanceOf(address(this)));
    }

    function setBotIncentiveBPs(uint16 newBotIncentiveBPs) external onlyOwner {
        botIncentiveBPs = newBotIncentiveBPs;
    }

    /**
     * @param newBaselinePaymentTokenAmount the new `baselinePaymentTokenAmount` in WAD format.
     */
    function setBaselinePaymentTokenAmount(uint256 newBaselinePaymentTokenAmount) external onlyOwner {
        baselinePaymentTokenAmount = newBaselinePaymentTokenAmount;
    }

    function setPriceFeed(IPriceFeed newPriceFeed) external onlyOwner {
        priceFeed = newPriceFeed;
    }

    /**
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      INTERNAL FUNCTIONS
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function ethAmountPerTokenAmount(uint256 tokenAmount) internal view returns (uint256) {
        (uint256 tokenPrice, uint8 priceDecimals) = price();
        return (tokenAmount * tokenPrice) / 10**priceDecimals;
    }

    function _redeem(address account, uint256 amount) internal {
        if (amount > 0) {
            iouToken.burn(account, amount);
            paymentToken.transfer(account, amount);
        }
    }

    function toWAD(uint256 value, uint8 decimals) internal pure returns (uint256) {
        if (decimals == WAD_DECIMALS) {
            return value;
        } else if (decimals < WAD_DECIMALS) {
            return value * 10**(WAD_DECIMALS - decimals);
        } else {
            return value / 10**(decimals - WAD_DECIMALS);
        }
    }

    function wadToTokenDecimals(uint256 value) internal view returns (uint256) {
        if (paymentTokenDecimals == WAD_DECIMALS) {
            return value;
        } else if (WAD_DECIMALS < paymentTokenDecimals) {
            return value * 10**(paymentTokenDecimals - WAD_DECIMALS);
        } else {
            return value / 10**(WAD_DECIMALS - paymentTokenDecimals);
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
