// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtilsV3 } from '../helpers/DeployUtilsV3.sol';
import { SigUtils, ERC1271Stub } from '../helpers/SigUtils.sol';
import { ProxyRegistryMock } from '../helpers/ProxyRegistryMock.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOV3Proposals } from '../../../contracts/governance/NounsDAOV3Proposals.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';

abstract contract NounsDAOLogicV3BaseTest is Test, DeployUtilsV3, SigUtils {
    event ProposalUpdated(
        uint256 indexed id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string updateMessage
    );

    event ProposalTransactionsUpdated(
        uint256 indexed id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string updateMessage
    );

    event ProposalDescriptionUpdated(
        uint256 indexed id,
        address indexed proposer,
        string description,
        string updateMessage
    );

    event ProposalCreated(
        uint256 id,
        address proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        uint256 startBlock,
        uint256 endBlock,
        string description
    );

    event ProposalCreatedWithRequirements(
        uint256 id,
        address proposer,
        address[] signers,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        uint256 startBlock,
        uint256 endBlock,
        uint256 updatePeriodEndBlock,
        uint256 proposalThreshold,
        uint256 quorumVotes,
        string description
    );

    NounsToken nounsToken;
    NounsDAOLogicV3 dao;
    NounsDAOExecutorV2 timelock;

    address noundersDAO = makeAddr('nounders');
    address minter;
    address vetoer = makeAddr('vetoer');
    uint32 lastMinuteWindowInBlocks = 10;
    uint32 objectionPeriodDurationInBlocks = 10;
    uint32 proposalUpdatablePeriodInBlocks = 10;
    address forkEscrow;

    function setUp() public virtual {
        dao = _deployDAOV3();
        nounsToken = NounsToken(address(dao.nouns()));
        minter = nounsToken.minter();
        timelock = NounsDAOExecutorV2(payable(address(dao.timelock())));
        forkEscrow = address(dao.forkEscrow());
    }

    function mintTo(address to) internal returns (uint256 tokenID) {
        vm.startPrank(minter);
        tokenID = nounsToken.mint();
        nounsToken.transferFrom(minter, to, tokenID);
        vm.stopPrank();
        vm.roll(block.number + 1);
    }

    function propose(
        address proposer,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description
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
        proposalId = dao.propose(targets, values, signatures, calldatas, description);
    }

    function updateProposal(
        address proposer,
        uint256 proposalId,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description
    ) internal {
        updateProposal(proposer, proposalId, target, value, signature, data, description, '');
    }

    function updateProposal(
        address proposer,
        uint256 proposalId,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description,
        string memory updateMessage
    ) internal {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        dao.updateProposal(proposalId, targets, values, signatures, calldatas, description, updateMessage);
    }

    function updateProposalTransactions(
        address proposer,
        uint256 proposalId,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory updateMessage
    ) internal {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        dao.updateProposalTransactions(proposalId, targets, values, signatures, calldatas, updateMessage);
    }

    function proposeBySigs(
        address proposer,
        address signer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp
    ) internal returns (uint256 proposalId) {
        address[] memory signers = new address[](1);
        signers[0] = signer;
        uint256[] memory signerPKs = new uint256[](1);
        signerPKs[0] = signerPK;
        uint256[] memory expirationTimestamps = new uint256[](1);
        expirationTimestamps[0] = expirationTimestamp;

        return proposeBySigs(proposer, signers, signerPKs, expirationTimestamps, txs, description);
    }

    function proposeBySigs(
        address proposer,
        address[] memory signers,
        uint256[] memory signerPKs,
        uint256[] memory expirationTimestamps,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description
    ) internal returns (uint256 proposalId) {
        NounsDAOStorageV3.ProposerSignature[] memory sigs = new NounsDAOStorageV3.ProposerSignature[](signers.length);
        for (uint256 i = 0; i < signers.length; ++i) {
            sigs[i] = NounsDAOStorageV3.ProposerSignature(
                signProposal(proposer, signerPKs[i], txs, description, expirationTimestamps[i], address(dao)),
                signers[i],
                expirationTimestamps[i]
            );
        }

        vm.prank(proposer);
        proposalId = dao.proposeBySigs(sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, description);
    }

    function updateProposalBySigs(
        uint256 proposalId,
        address proposer,
        address[] memory signers,
        uint256[] memory signerPKs,
        uint256[] memory expirationTimestamps,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description
    ) internal {
        NounsDAOStorageV3.ProposerSignature[] memory sigs = new NounsDAOStorageV3.ProposerSignature[](signers.length);
        for (uint256 i = 0; i < signers.length; ++i) {
            sigs[i] = NounsDAOStorageV3.ProposerSignature(
                signProposal(proposer, signerPKs[i], txs, description, expirationTimestamps[i], address(dao)),
                signers[i],
                expirationTimestamps[i]
            );
        }

        vm.prank(proposer);
        dao.updateProposalBySigs(
            proposalId,
            sigs,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            ''
        );
    }

    function makeTxs(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal pure returns (NounsDAOV3Proposals.ProposalTxs memory) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        return NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas);
    }

    function expectNewPropEvents(
        NounsDAOV3Proposals.ProposalTxs memory txs,
        address expectedProposer,
        uint256 expectedPropId,
        uint256 expectedPropThreshold,
        uint256 expectedMinQuorumVotes,
        address[] memory expectedSigners
    ) internal {
        uint256 expectedStartBlock = block.number + proposalUpdatablePeriodInBlocks + VOTING_DELAY;
        uint256 expectedEndBlock = expectedStartBlock + VOTING_PERIOD;

        vm.expectEmit(true, true, true, true);
        emit ProposalCreated(
            expectedPropId,
            expectedProposer,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            expectedStartBlock,
            expectedEndBlock,
            'description'
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCreatedWithRequirements(
            expectedPropId,
            expectedProposer,
            expectedSigners,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            expectedStartBlock,
            expectedEndBlock,
            block.number + proposalUpdatablePeriodInBlocks,
            expectedPropThreshold,
            expectedMinQuorumVotes,
            'description'
        );
    }
}
