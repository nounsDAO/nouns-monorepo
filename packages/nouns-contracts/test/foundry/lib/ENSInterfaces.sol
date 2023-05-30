// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface ENS {
    function resolver(bytes32 node) external view returns (address);

    function owner(bytes32 node) external view returns (address);
}

interface Resolver {
    function addr(bytes32 node) external view returns (address);

    function setAddr(bytes32 node, address a) external;
}

interface ReverseRegistrar {
    function setName(string memory name) external returns (bytes32);

    function node(address addr) external view returns (bytes32);

    function defaultResolver() external view returns (NameResolver);
}

interface NameResolver {
    function name(bytes32 node) external view returns (string memory);
}
