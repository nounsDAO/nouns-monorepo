// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../interfaces/ICryptopunks.sol";

contract CryptopunksMock is ICryptopunks {
    string public standard = 'CryptoPunks';

    mapping (uint => address) public punkIndexToAddress;
    mapping (address => uint256) public balanceOf;

    uint256 internal _currentPunkIndex;

    event Assign(address indexed to, uint256 punkIndex);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex);

    function transferPunk(address to, uint256 punkIndex) external {
        require(punkIndexToAddress[punkIndex] == msg.sender, "CryptopunksMock: A");
        require(punkIndex < 10000, "CryptopunksMock: B");

        punkIndexToAddress[punkIndex] = to;
        balanceOf[msg.sender]--;
        balanceOf[to]++;

        emit Transfer(msg.sender, to, 1);
        emit PunkTransfer(msg.sender, to, punkIndex);
    }

    //----------------- end of OG -----------------//

    function mint(address to) external {
        require(to != address(0), "CryptopunksMock: C");
        require(_currentPunkIndex < 10000, "CryptopunksMock: D");

        punkIndexToAddress[_currentPunkIndex] = to;
        balanceOf[to]++;
        emit Assign(to, _currentPunkIndex);
        _currentPunkIndex ++;
    }
}

