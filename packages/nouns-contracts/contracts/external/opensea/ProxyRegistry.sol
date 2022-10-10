// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "./IProxyRegistry.sol";

contract ProxyRegistry is IProxyRegistry {
    function proxies(address) external view returns (address) {
        return msg.sender;
    }
}
