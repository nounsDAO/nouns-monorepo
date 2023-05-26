// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { DeployUtilsV3 } from '../helpers/DeployUtilsV3.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOStorageV2, NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract NounsDAOLogic_GasSnapshot_propose is NounsDAOLogicSharedBaseTest {
    address immutable target = makeAddr('target');

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

abstract contract NounsDAOLogic_GasSnapshot_castVote is NounsDAOLogicSharedBaseTest {
    address immutable nouner = makeAddr('nouner');
    address immutable target = makeAddr('target');

    function setUp() public override {
        super.setUp();

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposer, 1);
        nounsToken.mint();
        nounsToken.transferFrom(minter, nouner, 2);
        vm.roll(block.number + 1);
        vm.stopPrank();

        givenProposal();
        vm.roll(block.number + daoProxy.votingDelay() + 1);
    }

    function givenProposal() internal {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';
        vm.prank(proposer);
        daoProxy.propose(targets, values, signatures, calldatas, 'short description');
    }

    function test_castVote_against() public {
        vm.prank(nouner);
        daoProxy.castVote(1, 0);
    }

    function test_castVoteWithReason() public {
        vm.prank(nouner);
        daoProxy.castVoteWithReason(1, 0, "I don't like this proposal");
    }

    function test_castVote_lastMinuteFor() public {
        vm.roll(block.number + VOTING_PERIOD - LAST_MINUTE_BLOCKS);
        vm.prank(nouner);
        daoProxy.castVote(1, 1);
    }
}

abstract contract NounsDAOLogic_GasSnapshot_castVoteDuringObjectionPeriod is NounsDAOLogicSharedBaseTest {
    address immutable nouner = makeAddr('nouner');
    address immutable target = makeAddr('target');

    function setUp() public override {
        super.setUp();

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposer, 1);
        nounsToken.mint();
        nounsToken.transferFrom(minter, nouner, 2);
        vm.roll(block.number + 1);
        vm.stopPrank();

        givenProposal();
        vm.roll(block.number + daoProxy.votingDelay() + 1);

        // activate objection period
        vm.roll(block.number + VOTING_PERIOD - LAST_MINUTE_BLOCKS);
        vm.prank(proposer);
        daoProxy.castVote(1, 1);
        // enter objection period
        vm.roll(block.number + LAST_MINUTE_BLOCKS + 1);
    }

    function givenProposal() internal {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';
        vm.prank(proposer);
        daoProxy.propose(targets, values, signatures, calldatas, 'short description');
    }

    function test_castVote_duringObjectionPeriod_against() public {
        vm.prank(nouner);
        daoProxy.castVote(1, 0);
    }
}

contract NounsDAOLogic_GasSnapshot_V3_propose is DeployUtilsV3, NounsDAOLogic_GasSnapshot_propose {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (NounsDAOLogicV1) {
        return _createDAOV3Proxy(timelock, nounsToken, vetoer);
    }
}

contract NounsDAOLogic_GasSnapshot_V2_propose is DeployUtilsV3, NounsDAOLogic_GasSnapshot_propose {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (NounsDAOLogicV1) {
        return _createDAOV2Proxy(timelock, nounsToken, vetoer);
    }
}

contract NounsDAOLogic_GasSnapshot_V3_vote is DeployUtilsV3, NounsDAOLogic_GasSnapshot_castVote {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (NounsDAOLogicV1) {
        return _createDAOV3Proxy(timelock, nounsToken, vetoer);
    }
}

contract NounsDAOLogic_GasSnapshot_V2_vote is DeployUtilsV3, NounsDAOLogic_GasSnapshot_castVote {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (NounsDAOLogicV1) {
        return _createDAOV2Proxy(timelock, nounsToken, vetoer);
    }
}

contract NounsDAOLogic_GasSnapshot_V3_voteDuringObjectionPeriod is
    DeployUtilsV3,
    NounsDAOLogic_GasSnapshot_castVoteDuringObjectionPeriod
{
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (NounsDAOLogicV1) {
        return _createDAOV3Proxy(timelock, nounsToken, vetoer);
    }
}
