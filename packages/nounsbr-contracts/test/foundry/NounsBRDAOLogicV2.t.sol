// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsBRDAOLogicV2 } from '../../contracts/governance/NounsBRDAOLogicV2.sol';
import { NounsBRDAOProxyV2 } from '../../contracts/governance/NounsBRDAOProxyV2.sol';
import { NounsBRDAOStorageV2, NounsBRDAOStorageV1Adjusted } from '../../contracts/governance/NounsBRDAOInterfaces.sol';
import { NounsBRDescriptorV2 } from '../../contracts/NounsBRDescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsBRToken } from '../../contracts/NounsBRToken.sol';
import { NounsBRSeeder } from '../../contracts/NounsBRSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsBRDAOExecutor } from '../../contracts/governance/NounsBRDAOExecutor.sol';

contract NounsBRDAOLogicV2Test is Test, DeployUtils {
    NounsBRDAOLogicV2 daoLogic;
    NounsBRDAOLogicV2 daoProxy;
    NounsBRToken nounsbrToken;
    NounsBRDAOExecutor timelock = new NounsBRDAOExecutor(address(1), TIMELOCK_DELAY);
    address vetoer = address(0x3);
    address admin = address(0x4);
    address noundersbrDAO = address(0x5);
    address minter = address(0x6);
    address proposer = address(0x7);
    uint256 votingPeriod = 6000;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;

    event Withdraw(uint256 amount, bool sent);

    function setUp() public virtual {
        daoLogic = new NounsBRDAOLogicV2();

        NounsBRDescriptorV2 descriptor = _deployAndPopulateV2();

        nounsbrToken = new NounsBRToken(noundersbrDAO, minter, descriptor, new NounsBRSeeder(), IProxyRegistry(address(0)));

        daoProxy = NounsBRDAOLogicV2(
            payable(
                new NounsBRDAOProxyV2(
                    address(timelock),
                    address(nounsbrToken),
                    vetoer,
                    admin,
                    address(daoLogic),
                    votingPeriod,
                    votingDelay,
                    proposalThresholdBPS,
                    NounsBRDAOStorageV2.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    })
                )
            )
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(daoProxy));
        vm.prank(address(daoProxy));
        timelock.acceptAdmin();
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}

contract CancelProposalTest is NounsBRDAOLogicV2Test {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.prank(minter);
        nounsbrToken.mint();

        vm.prank(minter);
        nounsbrToken.transferFrom(minter, proposer, 1);

        vm.roll(block.number + 1);

        proposalId = propose(address(0x1234), 100, '', '');
    }

    function testProposerCanCancelProposal() public {
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsBRDAOStorageV1Adjusted.ProposalState.Canceled));
    }

    function testNonProposerCantCancel() public {
        vm.expectRevert('NounsBRDAO::cancel: proposer above threshold');
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsBRDAOStorageV1Adjusted.ProposalState.Pending));
    }

    function testAnyoneCanCancelIfProposerVotesBelowThreshold() public {
        vm.prank(proposer);
        nounsbrToken.transferFrom(proposer, address(0x9999), 1);

        vm.roll(block.number + 1);

        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsBRDAOStorageV1Adjusted.ProposalState.Canceled));
    }
}

contract WithdrawTest is NounsBRDAOLogicV2Test {
    function setUp() public override {
        super.setUp();
    }

    function test_withdraw_worksForAdmin() public {
        vm.deal(address(daoProxy), 100 ether);
        uint256 balanceBefore = admin.balance;

        vm.expectEmit(true, true, true, true);
        emit Withdraw(100 ether, true);

        vm.prank(admin);
        (uint256 amount, bool sent) = daoProxy._withdraw();

        assertEq(amount, 100 ether);
        assertTrue(sent);
        assertEq(admin.balance - balanceBefore, 100 ether);
    }

    function test_withdraw_revertsForNonAdmin() public {
        vm.expectRevert(NounsBRDAOLogicV2.AdminOnly.selector);
        daoProxy._withdraw();
    }
}
