// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDAOStorageV1 } from '../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOLogicV1Test is Test, DeployUtils {
    NounsDAOLogicV1 daoProxy;
    NounsToken nounsToken;
    address minter = address(2);
    address proposer = address(1337);

    function setUp() public virtual {
        address noundersDAO = address(42);
        (address tokenAddress, address daoAddress) = _deployTokenAndDAOAndPopulateDescriptor(
            noundersDAO,
            noundersDAO,
            minter
        );

        nounsToken = NounsToken(tokenAddress);
        daoProxy = NounsDAOLogicV1(daoAddress);
    }
}

contract CancelProposalTest is NounsDAOLogicV1Test {
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.prank(minter);
        nounsToken.mint();

        vm.prank(minter);
        nounsToken.transferFrom(minter, proposer, 1);

        vm.roll(block.number + 1);

        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = address(0x1234);
        uint256[] memory values = new uint256[](1);
        values[0] = 100;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'my proposal');
    }

    function testProposerCanCancelProposal() public {
        vm.prank(proposer);
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1.ProposalState.Canceled));
    }

    function testNonProposerCantCancel() public {
        vm.expectRevert('NounsDAO::cancel: proposer above threshold');
        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1.ProposalState.Pending));
    }

    function testAnyoneCanCancelIfProposerVotesBelowThreshold() public {
        vm.prank(proposer);
        nounsToken.transferFrom(proposer, address(0x9999), 1);

        vm.roll(block.number + 1);

        daoProxy.cancel(proposalId);

        assertEq(uint256(daoProxy.state(proposalId)), uint256(NounsDAOStorageV1.ProposalState.Canceled));
    }
}
