// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { NounsDAOV3Proposals } from '../../../contracts/governance/NounsDAOV3Proposals.sol';

contract SigUtils is Test {
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,uint256 chainId,address verifyingContract)');

    bytes32 public constant PROPOSAL_TYPEHASH =
        keccak256(
            'Proposal(address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 expiry)'
        );

    function signProposal(
        address proposer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp,
        address verifyingContract
    ) public returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encodePacked(PROPOSAL_TYPEHASH, calcProposalEncodeData(proposer, txs, description), expirationTimestamp)
        );

        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256(bytes('Nouns DAO')), block.chainid, verifyingContract)
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
