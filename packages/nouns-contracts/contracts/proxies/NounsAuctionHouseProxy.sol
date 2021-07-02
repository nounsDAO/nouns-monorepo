// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.6;

import { TransparentUpgradeableProxy } from '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';

/**
 * @title The NounsDAO auction house proxy
 */
contract NounsAuctionHouseProxy is TransparentUpgradeableProxy {
    constructor(
        address logic,
        address admin,
        bytes memory data
    ) TransparentUpgradeableProxy(logic, admin, data) {}
}
