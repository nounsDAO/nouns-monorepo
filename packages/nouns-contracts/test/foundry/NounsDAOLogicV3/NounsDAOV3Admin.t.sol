// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOV3Admin } from '../../../contracts/governance/NounsDAOV3Admin.sol';

contract NounsDAOLogicV3AdminTest is NounsDAOLogicV3BaseTest {
    event ForkPeriodSet(uint256 oldForkPeriod, uint256 newForkPeriod);
    event ForkThresholdSet(uint256 oldForkThreshold, uint256 newForkThreshold);
    event ERC20TokensToIncludeInForkSet(address[] oldErc20Tokens, address[] newErc20tokens);

    address[] tokens;

    function test_setForkPeriod_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkPeriod(8 days);
    }

    function test_setForkPeriod_works() public {
        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ForkPeriodSet(7 days, 8 days);
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
        emit ForkThresholdSet(2000, 1234);
        dao._setForkThresholdBPS(1234);

        assertEq(dao.forkThresholdBPS(), 1234);
    }

    function test_setErc20TokensToIncludeInFork_onlyAdmin() public {
        tokens = [address(1), address(2)];

        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setErc20TokensToIncludeInFork(tokens);
    }

    function test_setErc20TokensToIncludeInFork_works() public {
        tokens = [address(1), address(2)];

        vm.prank(address(dao.timelock()));
        vm.expectEmit(true, true, true, true);
        emit ERC20TokensToIncludeInForkSet(new address[](0), tokens);
        dao._setErc20TokensToIncludeInFork(tokens);

        assertEq(dao.erc20TokensToIncludeInFork(), tokens);
    }

    function test_setForkEscrow_onlyAdmin() public {
        vm.expectRevert(NounsDAOV3Admin.AdminOnly.selector);
        dao._setForkEscrow(address(1));
    }

    function test_setForkEscrow_works() public {
        vm.prank(address(dao.timelock()));
        dao._setForkEscrow(address(1));

        assertEq(address(dao.forkEscrow()), address(1));
    }
}
