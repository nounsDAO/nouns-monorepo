// This file contains mock data for contracts to bypass the @nouns/contracts dependency
import { ethers } from 'ethers';

// Mock ABIs
export const NounsTokenABI = [
  'function dataURI(uint256 tokenId) external view returns (string)',
  'function seeds(uint256 tokenId) external view returns (tuple(uint48 background, uint48 body, uint48 accessory, uint48 head, uint48 glasses))',
  'function getCurrentVotes(address account) external view returns (uint256)',
  'function delegates(address account) external view returns (address)',
  'function getPriorVotes(address account, uint256 blockNumber) external view returns (uint256)',
  'function delegate(address delegatee) external',
  'function balanceOf(address owner) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function approve(address to, uint256 tokenId) external'
];

export const NounsDAODataABI = [
  'function createProposalCandidate(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description, uint256 proposalIdToUpdate) external payable returns (uint256)',
  'function cancelProposalCandidate(uint256 proposalId) external',
  'function addSignature(uint256 proposalId, string reason, uint256 expirationTimestamp, uint8 v, bytes32 r, bytes32 s) external',
  'function createCandidateCost() external view returns (uint256)',
  'function updateCandidateCost() external view returns (uint256)',
  'function updateProposalCandidate(uint256 proposalId, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description, string updateMessage) external payable',
  'function cancelSig(uint256 proposalId, uint256 sigIndex) external',
  'function sendCandidateFeedback(uint256 proposalId, uint8 support, string reason) external',
  'function sendFeedback(uint256 proposalId, uint8 support, string reason) external'
];

// Mock Factories
export class NounsTokenFactory {
  static connect(address: string, signer: ethers.Signer | undefined) {
    return new ethers.Contract(address, NounsTokenABI, signer);
  }

  attach(address: string) {
    return new ethers.Contract(address, NounsTokenABI);
  }
}

export class NounsDaoDataFactory {
  attach(address: string) {
    return new ethers.Contract(address, NounsDAODataABI);
  }
}

export class NounsDaoLogicFactory {
  static connect(address: string, signer: ethers.Signer | undefined) {
    return new ethers.Contract(address, [
      'function proposeBySigs(tuple(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description, uint256 expiry, uint8 v, bytes32 r, bytes32 s)[] sigs, address proposer, uint256 signerCount) external returns (uint256)',
      'function updateProposalBySigs(uint256 proposalId, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description, tuple(address signer, uint256 expiry, uint8 v, bytes32 r, bytes32 s)[] sigs) external'
    ], signer);
  }
}
