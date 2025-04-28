// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsDAOExecutorV2 } from '../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOData } from '../../contracts/governance/data/NounsDAOData.sol';
import { NounsAuctionHouseFork } from '../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { INounsToken } from '../../contracts/interfaces/INounsToken.sol';
import { NounsDAOLogicV1Fork } from '../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsTokenFork } from '../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { INounsDAOForkEscrow } from '../../contracts/governance/NounsDAOInterfaces.sol';

contract InitializersLocked is Test {
    function test_NounsDAOExecutorV2_locks_initializer() public {
        NounsDAOExecutorV2 c = new NounsDAOExecutorV2();
        vm.expectRevert('Initializable: contract is already initialized');
        c.initialize(address(0), 3 days);
    }

    function test_NounsDAOData_locks_initializer() public {
        NounsDAOData c = new NounsDAOData(address(1), address(2));
        vm.expectRevert('Initializable: contract is already initialized');
        c.initialize(address(1), 0, 0, payable(address(2)));
    }

    function test_NounsAuctionHouseFork_locks_initializer() public {
        NounsAuctionHouseFork c = new NounsAuctionHouseFork();
        vm.expectRevert('Initializable: contract is already initialized');
        c.initialize(address(0), INounsToken(address(0)), address(0), 0, 0, 0, 0);
    }

    function test_NounsDAOLogicV1Fork_locks_initializer() public {
        NounsDAOLogicV1Fork c = new NounsDAOLogicV1Fork();
        vm.expectRevert('Initializable: contract is already initialized');
        c.initialize(address(0), address(1), 0, 0, 0, 0, new address[](0), 0);
    }

    function test_NounsTokenFork_locks_initializer() public {
        NounsTokenFork c = new NounsTokenFork();
        vm.expectRevert('Initializable: contract is already initialized');
        c.initialize(address(0), address(1), INounsDAOForkEscrow(address(3)), 0, 0, 0, 0);
    }
}
