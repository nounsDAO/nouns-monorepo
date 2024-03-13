// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicBaseTest } from './NounsDAOLogicBaseTest.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOAdmin } from '../../../contracts/governance/NounsDAOAdmin.sol';

contract WithdrawTest is NounsDAOLogicBaseTest {
    event Withdraw(uint256 amount, bool sent);

    function test_withdraw_worksForAdmin() public {
        vm.deal(address(dao), 100 ether);
        uint256 balanceBefore = address(timelock).balance;

        vm.expectEmit(true, true, true, true);
        emit Withdraw(100 ether, true);

        vm.prank(address(timelock));
        (uint256 amount, bool sent) = dao._withdraw();

        assertEq(amount, 100 ether);
        assertTrue(sent);
        assertEq(address(timelock).balance - balanceBefore, 100 ether);
    }

    function test_withdraw_revertsForNonAdmin() public {
        vm.expectRevert(NounsDAOAdmin.AdminOnly.selector);
        dao._withdraw();
    }
}
