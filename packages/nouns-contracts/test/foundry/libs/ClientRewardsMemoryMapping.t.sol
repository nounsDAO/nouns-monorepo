// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { ClientRewardsMemoryMapping } from '../../../contracts/libs/ClientRewardsMemoryMapping.sol';

contract ClientRewardsMemoryMappingTest is Test {
    using ClientRewardsMemoryMapping for ClientRewardsMemoryMapping.Mapping;

    function test_set_get() public {
        ClientRewardsMemoryMapping.Mapping memory m = ClientRewardsMemoryMapping.createMapping({ maxClientId: 3 });

        m.set(0, 100);
        m.set(3, 200);
        assertEq(m.get(0), 100);
        assertEq(m.get(3), 200);
    }

    function test_inc() public {
        ClientRewardsMemoryMapping.Mapping memory m = ClientRewardsMemoryMapping.createMapping({ maxClientId: 3 });

        m.inc(0, 5);
        m.inc(0, 5);
        assertEq(m.get(0), 10);

        m.set(3, 200);
        m.inc(3, 50);
        assertEq(m.get(3), 250);
    }

    function test_id_too_high() public {
        ClientRewardsMemoryMapping.Mapping memory m = ClientRewardsMemoryMapping.createMapping({ maxClientId: 3 });

        // works
        m.set(3, 100);

        //fails
        vm.expectRevert();
        m.set(4, 100);
    }
}
