// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { DeployUtils } from '../helpers/DeployUtils.sol';
import { SigUtils, ERC1271Stub } from '../helpers/SigUtils.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOV3Proposals } from '../../../contracts/governance/NounsDAOV3Proposals.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../../contracts/governance/NounsDAOExecutor.sol';

contract UpdateProposalBySigsTest is NounsDAOLogicV3BaseTest {
    address proposer = makeAddr('proposerWithVote');
    address[] _signers;
    uint256[] _signerPKs;

    uint256 defaultExpirationTimestamp;
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        defaultExpirationTimestamp = block.timestamp + 1234;
        vm.startPrank(minter);
        for (uint256 i = 0; i < 8; ++i) {
            (address signer, uint256 signerPK) = makeAddrAndKey(string.concat('signerWithVote', Strings.toString(i)));
            _signers.push(signer);
            _signerPKs.push(signerPK);

            nounsToken.mint();
            nounsToken.transferFrom(minter, signer, i + 1);
        }

        vm.roll(block.number + 1);
        vm.stopPrank();

        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        proposalId = proposeBySigs(
            proposer,
            signers,
            signerPKs,
            expirationTimestamps,
            makeTxs(makeAddr('target'), 0, '', ''),
            ''
        );
    }

    function test_givenNoSigners_reverts() public {
        address[] memory signers = new address[](0);
        uint256[] memory signerPKs = new uint256[](0);
        uint256[] memory expirationTimestamps = new uint256[](0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.MustProvideSignatures.selector));
        updateProposalBySigs(
            proposalId,
            proposer,
            signers,
            signerPKs,
            expirationTimestamps,
            makeTxs(makeAddr('new target'), 0, '', ''),
            ''
        );
    }

    function test_givenMsgSenderNotProposer_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(makeAddr('not proposer'));
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.OnlyProposerCanEdit.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSignerMismatch_tooFewSigners_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = fewerSignersPKsExpirations();
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignerCountMismtach.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSignerMismatch_tooManySigners_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = moreSignersPKsExpirations();
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignerCountMismtach.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSignerMismatch_sameNumberOneDifferentSigner_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        // Swap a signer
        signers[1] = _signers[_signers.length - 1];
        signerPKs[1] = _signerPKs[_signers.length - 1];

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.OnlyProposerCanEdit.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenCanceledSig_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(sigs[1].signer);
        dao.cancelSig(sigs[1].sig);

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureIsCancelled.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenExpireddSig_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        expirationTimestamps[1] = block.timestamp - 1;

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureExpired.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentDescription_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, 'different description'),
            address(dao)
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentTargets_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        address[] memory updateTargets = txs.targets;

        // sign on differet new target
        address[] memory differentTargets = new address[](1);
        differentTargets[0] = makeAddr('different new target');
        txs.targets = differentTargets;
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        // set it back to the original new target
        txs.targets = updateTargets;
        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentValues_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        uint256[] memory updateValues = txs.values;

        // sign on differet values
        uint256[] memory differentValues = new uint256[](1);
        differentValues[0] = updateValues[0] + 1234;
        txs.values = differentValues;
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        // set it back to the original update values
        txs.values = updateValues;
        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentSignatures_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        string[] memory updateSignatures = txs.signatures;

        // sign on differet signatures
        string[] memory differentSignatures = new string[](1);
        differentSignatures[0] = 'different signature';
        txs.signatures = differentSignatures;
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        // set it back to the original update signatures
        txs.signatures = updateSignatures;
        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentCalldatas_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        bytes[] memory updateCalldatas = txs.calldatas;

        // sign on differet calldatas
        bytes[] memory differentCalldatas = new bytes[](1);
        differentCalldatas[0] = 'different calldatas';
        txs.calldatas = differentCalldatas;
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        // set it back to the original update calldatas
        txs.calldatas = updateCalldatas;
        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentExpiration_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        sigs[1].expirationTimestamp = sigs[1].expirationTimestamp + 1234;

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentSigner_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao)
        );

        sigs[1].signer = makeAddr('different signer');

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentDomainName_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            address(dao),
            'different domain name'
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentVerifyingContract_reverts() public {
        (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        ) = signersPKsExpirations();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('new target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory sigs = makeUpdateProposalSigs(
            signers,
            signerPKs,
            expirationTimestamps,
            UpdateProposalParams(proposalId, proposer, txs, ''),
            makeAddr('other verifying contract')
        );

        vm.prank(proposer);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        dao.updateProposalBySigs(proposalId, sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    // TODO test cases
    // given an invalid signature (all permutations), reverts
    // given a proposal that wasn't created with signers, reverts
    // given state other than updatable, reverts
    // given bad txs (arity, no items, too many items, etc.) reverts
    // works and emits

    function signersPKsExpirations(uint256 len)
        internal
        view
        returns (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        )
    {
        signers = new address[](len);
        signerPKs = new uint256[](len);
        expirationTimestamps = new uint256[](len);

        for (uint256 i = 0; i < len; ++i) {
            signers[i] = _signers[i];
            signerPKs[i] = _signerPKs[i];
            expirationTimestamps[i] = defaultExpirationTimestamp;
        }
    }

    function signersPKsExpirations()
        internal
        view
        returns (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        )
    {
        return signersPKsExpirations(2);
    }

    function fewerSignersPKsExpirations()
        internal
        view
        returns (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        )
    {
        return signersPKsExpirations(1);
    }

    function moreSignersPKsExpirations()
        internal
        view
        returns (
            address[] memory signers,
            uint256[] memory signerPKs,
            uint256[] memory expirationTimestamps
        )
    {
        return signersPKsExpirations(3);
    }
}
