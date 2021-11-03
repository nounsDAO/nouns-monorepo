// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import { NounsTokenLike } from './NounsTokenLike.sol';

interface NounDelegatorFactoryModuleLike {
    function avatar() external returns (address);

    function nouns() external returns (NounsTokenLike);
}
