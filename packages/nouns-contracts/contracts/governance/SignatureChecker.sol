// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.6;

import {EIP712} from "./EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import 'forge-std/console.sol';

contract SignatureChecker is EIP712("Nouns DAO", "V1") {
    function checkSig(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint256 nonce,
        uint40 expiry,
        bytes memory signature
    ) public view returns (address signer) {
        bytes32 proposalTypeHash = keccak256("Proposal(address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 nonce,uint40 expiry)");

        bytes32[] memory signatureHashes = new bytes32[](signatures.length);
        for (uint256 i=0; i<signatures.length; ++i) {
            signatureHashes[i] = keccak256(bytes(signatures[i]));
        }

        bytes32[] memory calldatasHashes = new bytes32[](calldatas.length);
        for (uint256 i=0; i<calldatas.length; ++i) {
            calldatasHashes[i] = keccak256(calldatas[i]);
        }

        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            proposalTypeHash,
            keccak256(abi.encodePacked(targets)),
            keccak256(abi.encodePacked(values)),
            keccak256(abi.encodePacked(signatureHashes)),
            keccak256(abi.encodePacked(calldatasHashes)),
            keccak256(bytes(description)),
            nonce,
            expiry
        )));

        signer = ECDSA.recover(digest, signature);
        console.log(">>>>>>> signer: ", signer);
    }
}
