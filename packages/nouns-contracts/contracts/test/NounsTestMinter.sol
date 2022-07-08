// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { INounsToken } from '../interfaces/INounsToken.sol';
import { NounsTokenHarness } from './NounsTokenHarness.sol';

contract NounsTestMinter {
    NounsTokenHarness public nouns;

    constructor(NounsTokenHarness nouns_) {
        nouns = nouns_;
    }

    function mintMany(address to, uint256 amount) public {
        for (uint256 i = 0; i < amount; i++) {
            nouns.mintTo(to);
        }
    }
}
