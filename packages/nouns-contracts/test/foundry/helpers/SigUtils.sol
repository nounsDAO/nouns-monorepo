// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { IERC1271 } from '@openzeppelin/contracts/interfaces/IERC1271.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOV3Proposals } from '../../../contracts/governance/NounsDAOV3Proposals.sol';

contract SigUtils is Test {
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,uint256 chainId,address verifyingContract)');

    bytes32 public constant PROPOSAL_TYPEHASH =
        keccak256(
            'Proposal(address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 expiry)'
        );

    bytes32 public constant UPDATE_PROPOSAL_TYPEHASH =
        keccak256(
            'UpdateProposal(uint256 proposalId,address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 expiry)'
        );

    /// @dev using this struct to prevent stack-too-deep.
    struct UpdateProposalParams {
        uint256 proposalId;
        address proposer;
        NounsDAOV3Proposals.ProposalTxs txs;
        string description;
    }

    function makeUpdateProposalSigs(
        address[] memory signers,
        uint256[] memory signerPKs,
        uint256[] memory expirationTimestamps,
        UpdateProposalParams memory proposalParams,
        address verifyingContract
    ) internal returns (NounsDAOStorageV3.ProposerSignature[] memory sigs) {
        return
            makeUpdateProposalSigs(
                signers,
                signerPKs,
                expirationTimestamps,
                proposalParams,
                verifyingContract,
                'Nouns DAO'
            );
    }

    function makeUpdateProposalSigs(
        address[] memory signers,
        uint256[] memory signerPKs,
        uint256[] memory expirationTimestamps,
        UpdateProposalParams memory proposalParams,
        address verifyingContract,
        string memory domainName
    ) internal returns (NounsDAOStorageV3.ProposerSignature[] memory sigs) {
        sigs = new NounsDAOStorageV3.ProposerSignature[](signers.length);
        for (uint256 i = 0; i < signers.length; ++i) {
            sigs[i] = NounsDAOStorageV3.ProposerSignature(
                signProposalUpdate(
                    proposalParams.proposalId,
                    proposalParams.proposer,
                    signerPKs[i],
                    proposalParams.txs,
                    proposalParams.description,
                    expirationTimestamps[i],
                    verifyingContract,
                    domainName
                ),
                signers[i],
                expirationTimestamps[i]
            );
        }
    }

    function signProposalUpdate(
        uint256 proposalId,
        address proposer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp,
        address verifyingContract,
        string memory domainName
    ) public returns (bytes memory) {
        return
            sign(
                abi.encodePacked(proposalId, calcProposalEncodeData(proposer, txs, description)),
                signerPK,
                expirationTimestamp,
                verifyingContract,
                domainName,
                UPDATE_PROPOSAL_TYPEHASH
            );
    }

    function signProposal(
        address proposer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp,
        address verifyingContract
    ) public returns (bytes memory) {
        return signProposal(proposer, signerPK, txs, description, expirationTimestamp, verifyingContract, 'Nouns DAO');
    }

    function signProposal(
        address proposer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp,
        address verifyingContract,
        string memory domainName
    ) public returns (bytes memory) {
        return
            sign(
                calcProposalEncodeData(proposer, txs, description),
                signerPK,
                expirationTimestamp,
                verifyingContract,
                domainName,
                PROPOSAL_TYPEHASH
            );
    }

    function sign(
        bytes memory proposalEncodeData,
        uint256 signerPK,
        uint256 expirationTimestamp,
        address verifyingContract,
        string memory domainName,
        bytes32 structTypeHash
    ) public returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encodePacked(structTypeHash, proposalEncodeData, expirationTimestamp));

        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(domainName)), block.chainid, verifyingContract)
        );

        bytes32 digest = ECDSA.toTypedDataHash(domainSeparator, structHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPK, digest);

        return bytes.concat(r, s, bytes1(v));
    }

    function calcProposalEncodeData(
        address proposer,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description
    ) internal pure returns (bytes memory) {
        bytes32[] memory signatureHashes = new bytes32[](txs.signatures.length);
        for (uint256 i = 0; i < txs.signatures.length; ++i) {
            signatureHashes[i] = keccak256(bytes(txs.signatures[i]));
        }

        bytes32[] memory calldatasHashes = new bytes32[](txs.calldatas.length);
        for (uint256 i = 0; i < txs.calldatas.length; ++i) {
            calldatasHashes[i] = keccak256(txs.calldatas[i]);
        }

        return
            abi.encode(
                proposer,
                keccak256(abi.encodePacked(txs.targets)),
                keccak256(abi.encodePacked(txs.values)),
                keccak256(abi.encodePacked(signatureHashes)),
                keccak256(abi.encodePacked(calldatasHashes)),
                keccak256(bytes(description))
            );
    }
}

contract ERC1271Stub is IERC1271 {
    mapping(bytes32 => bool) responses;

    /**
     * @dev Should return whether the signature provided is valid for the provided data
     */
    function isValidSignature(bytes32, bytes memory signature) external view returns (bytes4 magicValue) {
        bytes32 signatureHash = keccak256(signature);
        if (responses[signatureHash]) {
            return IERC1271.isValidSignature.selector;
        }
        return 0;
    }

    function setResponse(bytes32 signatureHash, bool response) external {
        responses[signatureHash] = response;
    }
}
