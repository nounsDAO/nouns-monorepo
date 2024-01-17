// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { INounsDAOLogicV3 } from '../../../contracts/interfaces/INounsDAOLogicV3.sol';
import { DeployUtilsPrecompiled } from '../helpers/DeployUtilsPrecompiled.sol';

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

    function getLongDescription() internal view returns (string memory) {
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
        vm.roll(block.number + deployUtils.VOTING_PERIOD() - deployUtils.LAST_MINUTE_BLOCKS());
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
        vm.roll(block.number + deployUtils.VOTING_PERIOD() - deployUtils.LAST_MINUTE_BLOCKS());
        vm.prank(proposer);
        daoProxy.castVote(1, 1);
        // enter objection period
        vm.roll(block.number + deployUtils.LAST_MINUTE_BLOCKS() + 1);
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

contract NounsDAOLogic_GasSnapshot_V3_propose is DeployUtilsPrecompiled, NounsDAOLogic_GasSnapshot_propose {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (INounsDAOLogicV3) {
        return createDeployUtils()._createDAOV3Proxy(timelock, nounsToken, vetoer);
    }
}

contract NounsDAOLogic_GasSnapshot_V3_vote is DeployUtilsPrecompiled, NounsDAOLogic_GasSnapshot_castVote {
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (INounsDAOLogicV3) {
        return createDeployUtils()._createDAOV3Proxy(timelock, nounsToken, vetoer);
    }

    function test_proposalsV3() public view {
        daoProxy.proposalsV3(1);
    }
}

contract NounsDAOLogic_GasSnapshot_V3_voteDuringObjectionPeriod is
    DeployUtilsPrecompiled,
    NounsDAOLogic_GasSnapshot_castVoteDuringObjectionPeriod
{
    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal override returns (INounsDAOLogicV3) {
        return createDeployUtils()._createDAOV3Proxy(timelock, nounsToken, vetoer);
    }
}
