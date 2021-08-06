// SPDX-License-Identifier: Unlicense

/// @title The NounsDAO auction house proxy

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒░░░ *
 * ░░░░░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒▒▒▒▒░░░▒▒▒▒▒▒▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░░░░░▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
*********************************/

pragma solidity ^0.8.6;

import { TransparentUpgradeableProxy } from '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';

contract NounsAuctionHouseProxy is TransparentUpgradeableProxy {
    constructor(
        address logic,
        address admin,
        bytes memory data
    ) TransparentUpgradeableProxy(logic, admin, data) {}
}
