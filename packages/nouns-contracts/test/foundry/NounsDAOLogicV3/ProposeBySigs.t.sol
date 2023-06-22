// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
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

contract ProposeBySigsTest is NounsDAOLogicV3BaseTest {
    address proposerWithVote = makeAddr('proposerWithVote');
    address proposerWithNoVotes = makeAddr('proposerWithNoVotes');
    address signerWithNoVotes;
    uint256 signerWithNoVotesPK;
    address signerWithVote1;
    uint256 signerWithVote1PK;
    address signerWithVote2;
    uint256 signerWithVote2PK;

    function setUp() public override {
        super.setUp();

        (signerWithNoVotes, signerWithNoVotesPK) = makeAddrAndKey('signerWithNoVotes');
        (signerWithVote1, signerWithVote1PK) = makeAddrAndKey('signerWithVote1');
        (signerWithVote2, signerWithVote2PK) = makeAddrAndKey('signerWithVote2');

        vm.prank(address(timelock));
        dao._setProposalThresholdBPS(1_000);

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposerWithVote, 1);
        nounsToken.mint();
        nounsToken.transferFrom(minter, signerWithVote1, 2);
        nounsToken.mint();
        nounsToken.transferFrom(minter, signerWithVote2, 3);
        vm.roll(block.number + 1);
        vm.stopPrank();
    }

    function test_givenNoSigs_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.MustProvideSignatures.selector));
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenCanceledSig_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, '', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.prank(signerWithVote1);
        dao.cancelSig(proposerSignatures[0].sig);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureIsCancelled.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenExpireddSig_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp - 1;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, '', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureExpired.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentDescription_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'different sig description',
                expirationTimestamp,
                address(dao)
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(
            proposerSignatures,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'prop description'
        );
    }

    function test_givenSigOnDifferentTargets_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.targets[0] = makeAddr('different target');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentValues_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.values[0] = 42;

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentSignatures_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.signatures[0] = 'different signature';

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentCalldatas_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.calldatas[0] = 'different calldatas';

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentExpiration_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        proposerSignatures[0].expirationTimestamp = expirationTimestamp + 1;

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentSigner_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        proposerSignatures[0].signer = makeAddr('different signer than sig');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentDomainName_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'description',
                expirationTimestamp,
                address(dao),
                'different domain name'
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentVerifyingContract_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'description',
                expirationTimestamp,
                makeAddr('different verifying contract')
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenERC1271CheckReturnsFalse_reverts() public {
        ERC1271Stub erc1271 = new ERC1271Stub();
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            address(erc1271),
            expirationTimestamp
        );
        erc1271.setResponse(keccak256(proposerSignatures[0].sig), false);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSignerWithAnActiveProp_reverts() public {
        propose(signerWithVote1, makeAddr('target'), 0, '', '', '');

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposerAlreadyHasALiveProposal.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithAnActiveProp_reverts() public {
        propose(proposerWithVote, makeAddr('target'), 0, '', '', '');

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposerAlreadyHasALiveProposal.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerAndSignerWithVotesButBelowThreshold_reverts() public {
        // Minting to push proposer and signer below threshold
        vm.startPrank(minter);
        for (uint256 i = 0; i < 16; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(NounsDAOV3Proposals.VotesBelowProposalThreshold.selector);
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithEnoughVotesAndSignerWithNoVotes_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithNoVotesPK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithNoVotes,
            expirationTimestamp
        );

        vm.expectRevert(NounsDAOV3Proposals.MustProvideSignatures.selector);
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerAndSignerWithEnoughVotesCombined_worksAndEmitsEvents() public {
        // Minting to push proposer below threshold, while combined with signer they have enough
        vm.startPrank(minter);
        for (uint256 i = 0; i < 6; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithVote1;
        expectNewPropEvents(txs, proposerWithVote, dao.proposalCount() + 1, 1, 0, expectedSigners);

        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithNoVotesAndSignerWithEnoughVotes_worksAndEmitsEvents() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithVote1;
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenOnesOfSignersHasNoVotes_signerIsFilteredOut() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](2);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithNoVotes,
                signerWithNoVotesPK,
                txs,
                'description',
                expirationTimestamp,
                address(dao)
            ),
            signerWithNoVotes,
            expirationTimestamp
        );
        proposerSignatures[1] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote2PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote2,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithVote2;
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        uint256 proposalId = dao.proposeBySigs(
            proposerSignatures,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'description'
        );

        NounsDAOStorageV3.ProposalCondensed memory proposal = dao.proposalsV3(proposalId);
        assertEq(proposal.signers, expectedSigners);
    }

    function test_givenProposerWithNoVotesAndTwoSignersWithEnoughVotes_worksAndEmitsEvents() public {
        // Minting to push a single signer below threshold
        vm.startPrank(minter);
        for (uint256 i = 0; i < 6; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](2);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );
        proposerSignatures[1] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote2PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote2,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](2);
        expectedSigners[0] = signerWithVote1;
        expectedSigners[1] = signerWithVote2;
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 1, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        uint256 proposalId = dao.proposeBySigs(
            proposerSignatures,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'description'
        );

        NounsDAOStorageV3.ProposalCondensed memory proposal = dao.proposalsV3(proposalId);
        assertEq(proposal.signers, expectedSigners);
    }

    function test_givenProposerWithNoVotesAndTwoSignaturesBySameSigner_reverts() public {
        // Minting to push a single signer below threshold
        vm.startPrank(minter);
        for (uint256 i = 0; i < 6; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](2);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );
        proposerSignatures[1] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithNoVotes,
                signerWithVote1PK,
                txs,
                'description',
                expirationTimestamp + 1,
                address(dao)
            ),
            signerWithVote1,
            expirationTimestamp + 1
        );

        vm.prank(proposerWithNoVotes);
        vm.expectRevert(NounsDAOV3Proposals.ProposerAlreadyHasALiveProposal.selector);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithNoVotesAndERC1271SignerWithEnoughVotes_worksAndEmitsEvents() public {
        ERC1271Stub erc1271 = new ERC1271Stub();
        vm.prank(signerWithVote1);
        nounsToken.delegate(address(erc1271));
        vm.roll(block.number + 1);

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            address(erc1271),
            expirationTimestamp
        );

        erc1271.setResponse(keccak256(proposerSignatures[0].sig), true);

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = address(erc1271);
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }
}
