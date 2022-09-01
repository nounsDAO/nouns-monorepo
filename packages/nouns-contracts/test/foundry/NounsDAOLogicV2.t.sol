// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV2 } from '../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxyV2 } from '../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV2 } from '../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOLogicV2Test is Test {
    NounsDAOLogicV2 daoLogic;
    NounsDAOLogicV2 daoProxy;
    address timelock = address(0x1);
    address nouns = address(0x2);
    address vetoer = address(0x3);
    address admin = address(0x4);
    uint256 votingPeriod = 6000;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;

    event NewPendingVetoer(address oldPendingVetoer, address newPendingVetoer);
    event NewVetoer(address oldVetoer, address newVetoer);

    function setUp() public {
        daoLogic = new NounsDAOLogicV2();

        daoProxy = NounsDAOLogicV2(
            payable(
                new NounsDAOProxyV2(
                    timelock,
                    nouns,
                    vetoer,
                    admin,
                    address(daoLogic),
                    votingPeriod,
                    votingDelay,
                    proposalThresholdBPS,
                    NounsDAOStorageV2.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    })
                )
            )
        );
    }

    function test_setPendingVetoer_failsIfNotCurrentVetoer() public {
        vm.expectRevert(NounsDAOLogicV2.VetoerOnly.selector);
        daoProxy._setPendingVetoer(address(0x1234));
    }

    function test_setPendingVetoer_updatePendingVetoer() public {
        assertEq(daoProxy.pendingVetoer(), address(0));

        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewPendingVetoer(address(0), pendingVetoer);
        daoProxy._setPendingVetoer(pendingVetoer);

        assertEq(daoProxy.pendingVetoer(), pendingVetoer);
    }

    function test_onlyPendingVetoerCanAcceptNewVetoer() public {
        address pendingVetoer = address(0x3333);

        vm.prank(vetoer);
        daoProxy._setPendingVetoer(pendingVetoer);

        vm.expectRevert(NounsDAOLogicV2.PendingVetoerOnly.selector);
        daoProxy._acceptVetoer();

        vm.prank(pendingVetoer);
        vm.expectEmit(true, true, true, true);
        emit NewVetoer(vetoer, pendingVetoer);
        daoProxy._acceptVetoer();

        assertEq(daoProxy.vetoer(), pendingVetoer);
        assertEq(daoProxy.pendingVetoer(), address(0x0));
    }

    function test_burnVetoPower_failsIfNotVetoer() public {
        vm.expectRevert('NounsDAO::_burnVetoPower: vetoer only');
        daoProxy._burnVetoPower();
    }

    function test_burnVetoPower_setsVetoerToZero() public {
        vm.prank(vetoer);
        vm.expectEmit(true, true, true, true);
        emit NewVetoer(vetoer, address(0));
        daoProxy._burnVetoPower();

        assertEq(daoProxy.vetoer(), address(0));
    }
}
