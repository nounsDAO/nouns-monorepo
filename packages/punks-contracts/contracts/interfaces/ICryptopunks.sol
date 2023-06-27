// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICryptopunks {
    event Assign(address indexed to, uint256 punkIndex);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex);

    function punkIndexToAddress(uint256 punkIndex) view external returns(address);
    function balanceOf(address owner) view external returns(uint256);
    function transferPunk(address to, uint256 punkIndex) external;
}