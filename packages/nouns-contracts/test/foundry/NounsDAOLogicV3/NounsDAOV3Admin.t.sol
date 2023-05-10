// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOV3Admin } from '../../../contracts/governance/NounsDAOV3Admin.sol';

contract NounsDAOLogicV3AdminTest is NounsDAOLogicV3BaseTest {
    event ForkPeriodSet(uint256 oldForkPeriod, uint256 newForkPeriod);
    event ForkThresholdSet(uint256 oldForkThreshold, uint256 newForkThreshold);

    function test_setForkPeriod_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkPeriod(8 days);
    }

    function test_setForkPeriod_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkPeriodSet(0, 8 days);
        dao._setForkPeriod(8 days);

        assertEq(dao.forkPeriod(), 8 days);
    }

    function test_setForkThresholdBPS_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkThresholdBPS(2000);
    }

    function test_setForkThresholdBPS_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkThresholdSet(0, 1234);
        dao._setForkThresholdBPS(1234);

        assertEq(dao.forkThresholdBPS(), 1234);
    }
}
