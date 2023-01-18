// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { N00unsDAOLogicV2 } from '../../contracts/governance/N00unsDAOLogicV2.sol';
import { N00unsDAOProxyV2 } from '../../contracts/governance/N00unsDAOProxyV2.sol';
import { N00unsDAOStorageV2, N00unsDAOStorageV1Adjusted } from '../../contracts/governance/N00unsDAOInterfaces.sol';
import { N00unsDescriptorV2 } from '../../contracts/N00unsDescriptorV2.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { N00unsToken } from '../../contracts/N00unsToken.sol';
import { N00unsSeeder } from '../../contracts/N00unsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { N00unsDAOExecutor } from '../../contracts/governance/N00unsDAOExecutor.sol';

contract N00unsDAOLogicV2Test is Test, DeployUtils {
    N00unsDAOLogicV2 daoLogic;
    N00unsDAOLogicV2 daoProxy;
    N00unsToken n00unsToken;
    N00unsDAOExecutor timelock = new N00unsDAOExecutor(address(1), TIMELOCK_DELAY);
    address vetoer = address(0x3);
    address admin = address(0x4);
    address n00undersDAO = address(0x5);
    address minter = address(0x6);
    address proposer = address(0x7);
    uint256 votingPeriod = 6000;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;

    event Withdraw(uint256 amount, bool sent);

    function setUp() public virtual {
        daoLogic = new N00unsDAOLogicV2();

        N00unsDescriptorV2 descriptor = _deployAndPopulateV2();

        n00unsToken = new N00unsToken(n00undersDAO, minter, descriptor, new N00unsSeeder(), IProxyRegistry(address(0)));

        daoProxy = N00unsDAOLogicV2(
            payable(
                new N00unsDAOProxyV2(
                    address(timelock),
                    address(n00unsToken),
                    vetoer,
                    admin,
                    address(daoLogic),
                    votingPeriod,
                    votingDelay,
                    proposalThresholdBPS,
                    N00unsDAOStorageV2.DynamicQuorumParams({
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

contract CancelProposalTest is N00unsDAOLogicV2Test {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.prank(minter);
        n00unsToken.mint();

        vm.prank(minter);
        n00unsToken.transferFrom(minter, proposer, 1);

        vm.roll(block.number + 1);

        proposalId = propose(address(0x1234), 100, '', '');
    }

    function testProposerCanCancelProposal() public {
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(N00unsDAOStorageV1Adjusted.ProposalState.Canceled));
    }

    function testNonProposerCantCancel() public {
        vm.expectRevert('N00unsDAO::cancel: proposer above threshold');
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(N00unsDAOStorageV1Adjusted.ProposalState.Pending));
    }

    function testAnyoneCanCancelIfProposerVotesBelowThreshold() public {
        vm.prank(proposer);
        n00unsToken.transferFrom(proposer, address(0x9999), 1);

        vm.roll(block.number + 1);

        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(N00unsDAOStorageV1Adjusted.ProposalState.Canceled));
    }
}

contract WithdrawTest is N00unsDAOLogicV2Test {
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
        vm.expectRevert(N00unsDAOLogicV2.AdminOnly.selector);
        daoProxy._withdraw();
    }
}
