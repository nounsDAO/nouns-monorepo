// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../interfaces/ICryptopunks.sol";

contract CryptopunksMock is ICryptopunks {
    string public standard = 'CryptoPunks';

    mapping (uint => address) public punkIndexToAddress;
    mapping (address => uint256) public balanceOf;

    uint256 internal _currentPunkIndex;

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

    function mintBatch(address to, uint256 amount) external {
        require(to != address(0), "CryptopunksMock: E");
        require(amount != 0, "CryptopunksMock: F");
        require(_currentPunkIndex + amount < 10000, "CryptopunksMock: G");

        for(uint256 i = 0 ; i < amount ; i ++) {
            punkIndexToAddress[_currentPunkIndex + i] = to;
            emit Assign(to, _currentPunkIndex + i);
        }
        balanceOf[to] += amount;
        _currentPunkIndex += amount;
    }
}

