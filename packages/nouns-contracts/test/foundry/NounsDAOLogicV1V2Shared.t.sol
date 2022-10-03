// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxy } from '../../contracts/governance/NounsDAOProxy.sol';
import { NounsDAOProxyV2 } from '../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOStorageV1, NounsDAOStorageV2 } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../contracts/governance/NounsDAOExecutor.sol';
import { NounsDAOLogicSharedBaseTest } from './helpers/NounsDAOLogicSharedBase.t.sol';

abstract contract NounsDAOLogicV1V2StateTest is NounsDAOLogicSharedBaseTest {
    function setUp() public override {
        super.setUp();

        vm.prank(minter);
        nounsToken.mint();

        vm.prank(minter);
        nounsToken.transferFrom(minter, proposer, 1);

        vm.roll(block.number + 1);
    }

    function testRevertsGivenProposalIdThatDoesntExist() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.expectRevert('NounsDAO::state: invalid proposal id');
        daoProxy.state(proposalId + 1);
    }

    function testPendingGivenProposalJustCreated() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Pending);
    }

    function testActiveGivenProposalPastVotingDelay() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.roll(block.number + daoProxy.votingDelay() + 1);
        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Active);
    }

    function testCanceledGivenCanceledProposal() public {
        uint256 proposalId = propose(address(0x1234), 100, '', '');
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertTrue(daoProxy.state(proposalId) == NounsDAOStorageV1.ProposalState.Canceled);
    }
}

contract NounsDAOLogicV1StateTest is NounsDAOLogicV1V2StateTest {
    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV1 daoLogic = new NounsDAOLogicV1();

        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxy(
                        address(timelock),
                        address(nounsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        1000
                    )
                )
            );
    }
}

contract NounsDAOLogicV2StateTest is NounsDAOLogicV1V2StateTest {
    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV2 daoLogic = new NounsDAOLogicV2();

        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxyV2(
                        address(timelock),
                        address(nounsToken),
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
}
