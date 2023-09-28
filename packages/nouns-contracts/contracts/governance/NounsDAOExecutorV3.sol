// SPDX-License-Identifier: BSD-3-Clause

/// @title The Nouns DAO executor and treasury, supporting DAO fork

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

// LICENSE
// NounsDAOExecutor2.sol is a modified version of Compound Lab's Timelock.sol:
// https://github.com/compound-finance/compound-protocol/blob/20abad28055a2f91df48a90f8bb6009279a4cb35/contracts/Timelock.sol
//
// Timelock.sol source code Copyright 2020 Compound Labs, Inc. licensed under the BSD-3-Clause license.
// With modifications by Nounders DAO.
//
// Additional conditions of BSD-3-Clause can be found here: https://opensource.org/licenses/BSD-3-Clause
//
// MODIFICATIONS
// NounsDAOExecutor2.sol is a modified version of NounsDAOExecutor.sol
//
// NounsDAOExecutor.sol modifications:
// NounsDAOExecutor.sol modifies Timelock to use Solidity 0.8.x receive(), fallback(), and built-in over/underflow protection
// This contract acts as executor of Nouns DAO governance and its treasury, so it has been modified to accept ETH.
//
//
// NounsDAOExecutor2.sol modifications:
// - `sendETH` and `sendERC20` functions used for DAO forks
// - is upgradable via UUPSUpgradeable. uses intializer instead of constructor.
// - `GRACE_PERIOD` has been increased from 14 days to 21 days to allow more time in case of a forking period

pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {INounsAuctionHouse} from "../interfaces/INounsAuctionHouse.sol";

interface RocketETH {
    function getEthValue(uint256 _rethAmount) external view returns (uint256);
}

interface INounsDAOV3 {
    function adjustedTotalSupply() external view returns (uint256);
}

interface INounsAuctionHouseV2 is INounsAuctionHouse {
    function prices(uint256 auctionCount) external view returns (Settlement[] memory settlements);
}

contract NounsDAOExecutorV3 is UUPSUpgradeable, Initializable {
    using SafeERC20 for IERC20;
    using Address for address payable;

    error NotEnoughAuctionHistory();
    error RocketETHConversionRateTooLow();
    error OnlyNounsDAOExecutor();

    event NewAdmin(address indexed newAdmin);
    event NewPendingAdmin(address indexed newPendingAdmin);
    event NewDelay(uint256 indexed newDelay);
    event CancelTransaction(
        bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
    );
    event ExecuteTransaction(
        bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
    );
    event QueueTransaction(
        bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
    );
    event ETHSent(address indexed to, uint256 amount);
    event ERC20Sent(address indexed to, address indexed erc20Token, uint256 amount);
    event AuctionSet(address oldAuction, address newAuction);
    event NumberOfPastAuctionsForMeanPriceSet(uint16 oldNumberOfPastAuctionsForMeanPrice, uint16 newNumberOfPastAuctionsForMeanPrice);

    string public constant NAME = "NounsDAOExecutorV3";

    /// @dev increased grace period from 14 days to 21 days to allow more time in case of a forking period
    uint256 public constant GRACE_PERIOD = 21 days;
    uint256 public constant MINIMUM_DELAY = 2 days;
    uint256 public constant MAXIMUM_DELAY = 30 days;

    address public admin;
    address public pendingAdmin;
    uint256 public delay;
    INounsAuctionHouseV2 public auction;
    IERC20 public stETH;
    IERC20 public wETH;
    IERC20 public rETH;
    uint16 public numberOfPastAuctionsForMeanPrice;

    mapping(bytes32 => bool) public queuedTransactions;

    constructor() initializer {}

    function initialize(address admin_, uint256 delay_) public virtual initializer {
        require(delay_ >= MINIMUM_DELAY, "NounsDAOExecutor::constructor: Delay must exceed minimum delay.");
        require(delay_ <= MAXIMUM_DELAY, "NounsDAOExecutor::setDelay: Delay must not exceed maximum delay.");

        admin = admin_;
        delay = delay_;
    }

    function setDelay(uint256 delay_) public {
        require(msg.sender == address(this), "NounsDAOExecutor::setDelay: Call must come from NounsDAOExecutor.");
        require(delay_ >= MINIMUM_DELAY, "NounsDAOExecutor::setDelay: Delay must exceed minimum delay.");
        require(delay_ <= MAXIMUM_DELAY, "NounsDAOExecutor::setDelay: Delay must not exceed maximum delay.");
        delay = delay_;

        emit NewDelay(delay_);
    }

    function setAuction(INounsAuctionHouseV2 newAuction) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        emit AuctionSet(address(auction), address(newAuction));

        auction = newAuction;
    }

    function setSTETH(IERC20 newSTETH) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        stETH = newSTETH;
    }

    function setWETH(IERC20 newWETH) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        wETH = newWETH;
    }

    function setRETH(IERC20 newRETH) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        rETH = newRETH;
    }

    function setNumberOfPastAuctionsForMeanPrice(uint16 newNumberOfPastAuctionsForMeanPrice) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        emit NumberOfPastAuctionsForMeanPriceSet(numberOfPastAuctionsForMeanPrice, newNumberOfPastAuctionsForMeanPrice);

        numberOfPastAuctionsForMeanPrice = newNumberOfPastAuctionsForMeanPrice;
    }

    function setBurnParams(INounsAuctionHouseV2 newAuction, IERC20 newSTETH, IERC20 newWETH, IERC20 newRETH, uint16 newNumberOfPastAuctionsForMeanPrice) public {
        if (msg.sender != address(this)) revert OnlyNounsDAOExecutor();

        setAuction(newAuction);
        setSTETH(newSTETH);
        setWETH(newWETH);
        setRETH(newRETH);
        setNumberOfPastAuctionsForMeanPrice(newNumberOfPastAuctionsForMeanPrice);
    }

    function acceptAdmin() public {
        require(msg.sender == pendingAdmin, "NounsDAOExecutor::acceptAdmin: Call must come from pendingAdmin.");
        admin = msg.sender;
        pendingAdmin = address(0);

        emit NewAdmin(msg.sender);
    }

    function setPendingAdmin(address pendingAdmin_) public {
        require(msg.sender == address(this), "NounsDAOExecutor::setPendingAdmin: Call must come from NounsDAOExecutor.");
        pendingAdmin = pendingAdmin_;

        emit NewPendingAdmin(pendingAdmin_);
    }

    function queueTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
        public
        returns (bytes32)
    {
        require(msg.sender == admin, "NounsDAOExecutor::queueTransaction: Call must come from admin.");
        require(
            eta >= getBlockTimestamp() + delay,
            "NounsDAOExecutor::queueTransaction: Estimated execution block must satisfy delay."
        );

        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = true;

        emit QueueTransaction(txHash, target, value, signature, data, eta);
        return txHash;
    }

    function cancelTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
        public
    {
        require(msg.sender == admin, "NounsDAOExecutor::cancelTransaction: Call must come from admin.");

        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = false;

        emit CancelTransaction(txHash, target, value, signature, data, eta);
    }

    function executeTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
        public
        returns (bytes memory)
    {
        require(msg.sender == admin, "NounsDAOExecutor::executeTransaction: Call must come from admin.");

        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        require(queuedTransactions[txHash], "NounsDAOExecutor::executeTransaction: Transaction hasn't been queued.");
        require(
            getBlockTimestamp() >= eta, "NounsDAOExecutor::executeTransaction: Transaction hasn't surpassed time lock."
        );
        require(
            getBlockTimestamp() <= eta + GRACE_PERIOD, "NounsDAOExecutor::executeTransaction: Transaction is stale."
        );

        queuedTransactions[txHash] = false;

        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }

        // solium-disable-next-line security/no-call-value
        (bool success, bytes memory returnData) = target.call{value: value}(callData);
        require(success, "NounsDAOExecutor::executeTransaction: Transaction execution reverted.");

        emit ExecuteTransaction(txHash, target, value, signature, data, eta);

        return returnData;
    }

    function getBlockTimestamp() internal view returns (uint256) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp;
    }

    receive() external payable {}

    fallback() external payable {}

    function sendETH(address payable recipient, uint256 ethToSend) external {
        require(msg.sender == admin, "NounsDAOExecutor::sendETH: Call must come from admin.");

        recipient.sendValue(ethToSend);

        emit ETHSent(recipient, ethToSend);
    }

    function sendERC20(address recipient, address erc20Token, uint256 tokensToSend) external {
        require(msg.sender == admin, "NounsDAOExecutor::sendERC20: Call must come from admin.");

        IERC20(erc20Token).safeTransfer(recipient, tokensToSend);

        emit ERC20Sent(recipient, erc20Token, tokensToSend);
    }

    function burnExcessETH() public {
        payable(address(0)).sendValue(min(excessETH(), address(this).balance));
    }

    function excessETH() public view returns (uint256) {
        uint256 expectedTreasuryValue = meanAuctionPrice() * INounsDAOV3(admin).adjustedTotalSupply();
        return treasuryValueInETH() - expectedTreasuryValue;
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
        address me = address(this);
        return me.balance + stETH.balanceOf(me) + wETH.balanceOf(me) + rETHBalanceInETH();
    }

    function rETHBalanceInETH() public view returns (uint256) {
        return RocketETH(address(rETH)).getEthValue(rETH.balanceOf(address(this)));        
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address) internal view override {
        require(
            msg.sender == address(this), "NounsDAOExecutor::_authorizeUpgrade: Call must come from NounsDAOExecutor."
        );
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
