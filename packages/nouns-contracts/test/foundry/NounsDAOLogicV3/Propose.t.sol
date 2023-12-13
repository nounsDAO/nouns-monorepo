// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';

contract ProposeTest is NounsDAOLogicV3BaseTest {
    address proposer = makeAddr('proposer');

    function setUp() public override {
        super.setUp();

        vm.prank(address(dao.timelock()));
        dao._setProposalThresholdBPS(1_000);

        for (uint256 i = 0; i < 10; i++) {
            mintTo(proposer);
        }
    }

    function testEmits_ProposalCreatedWithRequirements() public {
        address[] memory targets = new address[](1);
        targets[0] = makeAddr('target');
        uint256[] memory values = new uint256[](1);
        values[0] = 42;
        string[] memory signatures = new string[](1);
        signatures[0] = 'some signature';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';

        uint256 updatablePeriodEndBlock = block.number + dao.proposalUpdatablePeriodInBlocks();
        uint256 startBlock = updatablePeriodEndBlock + dao.votingDelay();
        uint256 endBlock = startBlock + dao.votingPeriod();

        vm.expectEmit(true, true, true, true);

        emit ProposalCreatedWithRequirements(
            1,
            proposer,
            new address[](0),
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            endBlock,
            updatablePeriodEndBlock,
            1, // prop threshold
            dao.minQuorumVotes(),
            'some description'
        );

        vm.prank(proposer);

        dao.propose(targets, values, signatures, calldatas, 'some description');
    }
}
