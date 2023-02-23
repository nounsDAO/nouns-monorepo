// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOStorageV2, NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract NounsDAOLogic_GasSnapshot_propose is NounsDAOLogicSharedBaseTest {

    address immutable target = makeAddr("target");


    function setUp() public override {
        super.setUp();

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposer, 1);
        vm.roll(block.number + 1);
        vm.stopPrank();
    }

    function test_propose_shortDescription() public {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';
        daoProxy.propose(targets, values, signatures, calldatas, 'short description');
    }

    function test_propose_longDescription() public {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';
        daoProxy.propose(targets, values, signatures, calldatas, getLongDescription());
    }

    function getLongDescription() internal returns (string memory) {
        return vm.readFile('./test/foundry/files/longProposalDescription.txt');
    }
}

contract NounsDAOLogic_GasSnapshot_V3 is NounsDAOLogic_GasSnapshot_propose {
    function daoVersion() internal pure override returns (uint256) {
        return 3;
    }

    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        return NounsDAOLogicV1(
            payable(
                new NounsDAOProxyV3(
                    NounsDAOProxyV3.ProxyParams(address(timelock), address(new NounsDAOLogicV3())),
                    address(timelock),
                    address(nounsToken),
                    vetoer,
                    VOTING_PERIOD,
                    VOTING_DELAY,
                    PROPOSAL_THRESHOLD,
                    NounsDAOStorageV3.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    }),
                    0,
                    0,
                    0,
                    0
                )
            )
        );
    }
}

contract NounsDAOLogic_GasSnapshot_V2 is NounsDAOLogic_GasSnapshot_propose {
    function daoVersion() internal pure override returns (uint256) {
        return 2;
    }

    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        return NounsDAOLogicV1(
            payable(
                new NounsDAOProxyV2(
                    address(timelock),
                        address(nounsToken),
                        vetoer,
                        admin,
                        address(new NounsDAOLogicV2()),
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