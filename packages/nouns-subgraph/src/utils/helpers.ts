import { Address, BigInt, Bytes, crypto, ethereum } from '@graphprotocol/graph-ts';
import {
  Account,
  Delegate,
  Proposal,
  Governance,
  Vote,
  DynamicQuorumParams,
  ProposalVersion,
  ProposalCandidateVersion,
  ProposalCandidate,
  ProposalCandidateSignature,
  ProposalFeedback,
  Fork,
  ProposalCandidateContent,
  CandidateFeedback,
} from '../types/schema';
import { ZERO_ADDRESS, BIGINT_ZERO, BIGINT_ONE } from './constants';

export class GetOrCreateResult<T> {
  entity: T | null;
  created: boolean;

  constructor(entity: T | null, created: boolean) {
    this.entity = entity;
    this.created = created;
  }
}

export function getOrCreateAccount(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): Account {
  let tokenHolder = Account.load(id);

  if (tokenHolder == null && createIfNotFound) {
    tokenHolder = new Account(id);
    tokenHolder.tokenBalanceRaw = BIGINT_ZERO;
    tokenHolder.tokenBalance = BIGINT_ZERO;
    tokenHolder.totalTokensHeldRaw = BIGINT_ZERO;
    tokenHolder.totalTokensHeld = BIGINT_ZERO;
    tokenHolder.nouns = [];

    if (save) {
      tokenHolder.save();
    }
  }

  return tokenHolder as Account;
}

// These two functions are split up to minimize the extra code required
// to handle return types with `Type | null`
export function getOrCreateDelegate(id: string): Delegate {
  return getOrCreateDelegateWithNullOption(id, true, true).entity!;
}

export function getOrCreateDelegateWithNullOption(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): GetOrCreateResult<Delegate> {
  let delegate = Delegate.load(id);
  let created = false;
  if (delegate == null && createIfNotFound) {
    created = true;
    delegate = new Delegate(id);
    delegate.delegatedVotesRaw = BIGINT_ZERO;
    delegate.delegatedVotes = BIGINT_ZERO;
    delegate.tokenHoldersRepresentedAmount = 0;
    delegate.nounsRepresented = [];
    if (id != ZERO_ADDRESS) {
      let governance = getGovernanceEntity();
      governance.totalDelegates = governance.totalDelegates.plus(BIGINT_ONE);
      governance.save();
    }
    if (save) {
      delegate.save();
    }
  }

  return new GetOrCreateResult<Delegate>(delegate, created);
}

export function getOrCreateVote(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = false,
): Vote {
  let vote = Vote.load(id);

  if (vote == null && createIfNotFound) {
    vote = new Vote(id);
    vote.clientId = 0;

    if (save) {
      vote.save();
    }
  }

  return vote as Vote;
}

export function getOrCreateProposal(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = false,
): Proposal {
  let proposal = Proposal.load(id);

  if (proposal == null && createIfNotFound) {
    proposal = new Proposal(id);

    let governance = getGovernanceEntity();

    governance.proposals = governance.proposals.plus(BIGINT_ONE);
    governance.save();

    if (save) {
      proposal.save();
    }
  }

  return proposal as Proposal;
}

export function getGovernanceEntity(): Governance {
  let governance = Governance.load('GOVERNANCE');

  if (governance == null) {
    governance = new Governance('GOVERNANCE');
    governance.proposals = BIGINT_ZERO;
    governance.totalTokenHolders = BIGINT_ZERO;
    governance.currentTokenHolders = BIGINT_ZERO;
    governance.currentDelegates = BIGINT_ZERO;
    governance.totalDelegates = BIGINT_ZERO;
    governance.delegatedVotesRaw = BIGINT_ZERO;
    governance.delegatedVotes = BIGINT_ZERO;
    governance.proposalsQueued = BIGINT_ZERO;
    governance.voteSnapshotBlockSwitchProposalId = BIGINT_ZERO;
    governance.candidates = BIGINT_ZERO;
  }

  return governance as Governance;
}

export function getOrCreateDynamicQuorumParams(block: BigInt | null = null): DynamicQuorumParams {
  let params = DynamicQuorumParams.load('LATEST');

  if (params == null) {
    params = new DynamicQuorumParams('LATEST');
    params.minQuorumVotesBPS = 0;
    params.maxQuorumVotesBPS = 0;
    params.quorumCoefficient = BIGINT_ZERO;
    params.dynamicQuorumStartBlock = block;

    params.save();
  }

  if (params.dynamicQuorumStartBlock === null && block !== null) {
    params.dynamicQuorumStartBlock = block;

    params.save();
  }

  return params as DynamicQuorumParams;
}

export function getOrCreateProposalVersion(id: string): ProposalVersion {
  let update = ProposalVersion.load(id);
  if (update == null) {
    update = new ProposalVersion(id);
  }
  return update;
}

export function getOrCreateProposalCandidate(id: string): ProposalCandidate {
  let candidate = ProposalCandidate.load(id);
  if (candidate == null) {
    candidate = new ProposalCandidate(id);

    const governance = getGovernanceEntity();
    governance.candidates = governance.candidates.plus(BIGINT_ONE);
    governance.save();
  }

  return candidate;
}

export function getOrCreateProposalCandidateVersion(id: string): ProposalCandidateVersion {
  let version = ProposalCandidateVersion.load(id);
  if (version == null) {
    version = new ProposalCandidateVersion(id);
  }
  return version;
}

export function getOrCreateProposalCandidateContent(id: string): ProposalCandidateContent {
  let content = ProposalCandidateContent.load(id);
  if (content == null) {
    content = new ProposalCandidateContent(id);
  }
  return content;
}

export function getOrCreateProposalCandidateSignature(id: string): ProposalCandidateSignature {
  let sig = ProposalCandidateSignature.load(id);
  if (sig == null) {
    sig = new ProposalCandidateSignature(id);
    sig.canceled = false;
  }
  return sig;
}

export function getOrCreateProposalFeedback(id: string): ProposalFeedback {
  let feedback = ProposalFeedback.load(id);
  if (feedback == null) {
    feedback = new ProposalFeedback(id);
  }
  return feedback;
}

export function getOrCreateCandidateFeedback(id: string): CandidateFeedback {
  let feedback = CandidateFeedback.load(id);
  if (feedback == null) {
    feedback = new CandidateFeedback(id);
  }
  return feedback;
}

export function getOrCreateFork(id: BigInt): Fork {
  let fork = Fork.load(id.toString());
  if (fork == null) {
    fork = new Fork(id.toString());
    fork.forkID = id;
    fork.tokensInEscrowCount = 0;
    fork.tokensForkingCount = 0;
  }
  return fork;
}

export function getCandidateIndex(): BigInt {
  const governance = getGovernanceEntity();
  return governance.candidates;
}

export function candidateID(proposer: Address, slug: string): string {
  return proposer.toHexString().concat('-').concat(slug);
}

function keccak256Bytes(bytes: Bytes): Bytes {
  return Bytes.fromByteArray(crypto.keccak256(bytes));
}

/**
 * encodes the proposal content as done in `NounsDAOProposals.calcProposalEncodeData`
 * and hashes it with keccak256
 */
export function calcEncodedProposalHash(proposal: Proposal, isUpdate: boolean): Bytes {
  let signatureHashes = Bytes.fromUTF8('');
  for (let i = 0; i < proposal.signatures!.length; i++) {
    signatureHashes = signatureHashes.concat(
      keccak256Bytes(Bytes.fromUTF8(proposal.signatures![i])),
    );
  }
  let calldatasHashes = Bytes.fromUTF8('');
  for (let i = 0; i < proposal.calldatas!.length; i++) {
    calldatasHashes = calldatasHashes.concat(keccak256Bytes(proposal.calldatas![i]));
  }
  let targetsConcat = Bytes.fromUTF8('');
  for (let i = 0; i < proposal.targets!.length; i++) {
    targetsConcat = targetsConcat.concat(
      Bytes.fromHexString(proposal.targets![i].toHex().replace('0x', '').padStart(64, '0')),
    );
  }
  let valuesConcat = Bytes.fromUTF8('');
  for (let i = 0; i < proposal.values!.length; i++) {
    valuesConcat = valuesConcat.concat(
      Bytes.fromHexString(proposal.values![i].toHex().replace('0x', '').padStart(64, '0')),
    );
  }

  let params = new ethereum.Tuple();
  params.push(ethereum.Value.fromAddress(Address.fromString(proposal.proposer!)));
  params.push(ethereum.Value.fromFixedBytes(keccak256Bytes(targetsConcat)));
  params.push(ethereum.Value.fromFixedBytes(keccak256Bytes(valuesConcat)));
  params.push(ethereum.Value.fromFixedBytes(keccak256Bytes(signatureHashes)));
  params.push(ethereum.Value.fromFixedBytes(keccak256Bytes(calldatasHashes)));
  params.push(ethereum.Value.fromFixedBytes(keccak256Bytes(Bytes.fromUTF8(proposal.description!))));

  let proposalEncodeData = ethereum.encode(ethereum.Value.fromTuple(params))!;

  if (isUpdate) {
    const proposalId = Bytes.fromHexString(
      BigInt.fromString(proposal.id).toHex().replace('0x', '').padStart(64, '0'),
    );
    proposalEncodeData = proposalId.concat(proposalEncodeData);
  }

  const hashedProposal = keccak256Bytes(proposalEncodeData);
  return hashedProposal;
}
