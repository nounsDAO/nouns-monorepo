// SPDX-License-Identifier: MIT

/**
 * Minimal ProxyRegistry contract as per OpenSea
 */

pragma solidity ^0.8.6;

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}