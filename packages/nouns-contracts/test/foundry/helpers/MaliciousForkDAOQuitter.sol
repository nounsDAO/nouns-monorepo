// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';

contract MaliciousForkDAOQuitter {
    NounsDAOLogicV1Fork public dao;
    uint256[] public tokenIds;
    bool triedReentry;

    constructor(NounsDAOLogicV1Fork dao_) {
        dao = dao_;
    }

    function setTokenIds(uint256[] calldata tokenIds_) external {
        tokenIds = tokenIds_;
    }

    receive() external payable {
        if (!triedReentry) {
            triedReentry = true;
            dao.quit(tokenIds);
        }
    }
}
