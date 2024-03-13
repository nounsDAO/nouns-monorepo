// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { ETHString } from '../../../contracts/libs/ETHString.sol';

contract ETHStringTest is Test {
    using ETHString for uint256;

    function test_toETHString_works() public {
        uint256 amount = 1420000000000000000;
        assertEq(amount.toETHString(), '1.42');

        amount = 42000000000000000000;
        assertEq(amount.toETHString(), '42.00');

        amount = 4200000000000000000;
        assertEq(amount.toETHString(), '4.20');

        amount = 4020000000000000000;
        assertEq(amount.toETHString(), '4.02');
    }
}
