// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';

contract ProxyRegistryMock is IProxyRegistry {
    function proxies(address) external pure returns (address) {
        return address(0);
    }
}