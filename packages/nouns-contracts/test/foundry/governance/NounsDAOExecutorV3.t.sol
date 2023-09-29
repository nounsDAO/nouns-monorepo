// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsExcessETH } from '../helpers/DeployUtilsExcessETH.sol';
import { NounsDAOExecutorV3 } from '../../../contracts/governance/NounsDAOExecutorV3.sol';
import { IExcessETH } from '../../../contracts/interfaces/IExcessETH.sol';

contract ExcessETHMock is IExcessETH {
    uint256 excess;

    function setExcess(uint256 excess_) public {
        excess = excess_;
    }

    function excessETH() public view returns (uint256) {
        return excess;
    }
}

contract NounsDAOExecutorV3Test is DeployUtilsExcessETH {
    event ETHBurned(uint256 amount);

    NounsDAOExecutorV3 treasury;
    ExcessETHMock excessETH;

    address dao = makeAddr('dao');

    function setUp() public {
        treasury = _deployExecutorV3(dao);
        excessETH = new ExcessETHMock();

        vm.prank(address(treasury));
        treasury.setExcessETHHelper(excessETH);
    }

    function test_setExcessETHHelper_revertsForNonTreasury() public {
        vm.expectRevert('NounsDAOExecutor::setExcessETHHelper: Call must come from NounsDAOExecutor.');
        treasury.setExcessETHHelper(excessETH);
    }

    function test_setExcessETHHelper_worksForTreasury() public {
        ExcessETHMock newExcessETH = new ExcessETHMock();

        assertTrue(address(treasury.excessETHHelper()) != address(newExcessETH));

        vm.prank(address(treasury));
        treasury.setExcessETHHelper(newExcessETH);

        assertEq(address(treasury.excessETHHelper()), address(newExcessETH));
    }

    function test_burnExcessETH_givenHelperNotSet_reverts() public {
        vm.prank(address(treasury));
        treasury.setExcessETHHelper(IExcessETH(address(0)));

        vm.expectRevert(abi.encodeWithSelector(NounsDAOExecutorV3.ExcessETHHelperNotSet.selector));
        treasury.burnExcessETH();
    }

    function test_burnExcessETH_givenExcessIsZero_reverts() public {
        excessETH.setExcess(0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOExecutorV3.NoExcessToBurn.selector));
        treasury.burnExcessETH();
    }

    function test_burnExcessETH_givenExcess_burnsAddsToTotalAndEmits() public {
        vm.deal(address(treasury), 142 ether);
        excessETH.setExcess(100 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHBurned(100 ether);

        treasury.burnExcessETH();
        assertEq(treasury.totalETHBurned(), 100 ether);

        excessETH.setExcess(42 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHBurned(42 ether);

        treasury.burnExcessETH();
        assertEq(treasury.totalETHBurned(), 142 ether);
    }
}
