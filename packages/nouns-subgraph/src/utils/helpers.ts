import { BigInt } from '@graphprotocol/graph-ts';
import {
  Account,
  Delegate,
  Proposal,
  Governance,
  Vote,
  DynamicQuorumParams,
} from '../types/schema';
import { ZERO_ADDRESS, BIGINT_ZERO, BIGINT_ONE } from './constants';

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
  return getOrCreateDelegateWithNullOption(id, true, true) as Delegate;
}

export function getOrCreateDelegateWithNullOption(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): Delegate | null {
  let delegate = Delegate.load(id);
  if (delegate == null && createIfNotFound) {
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
  return delegate;
}

export function getOrCreateVote(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = false,
): Vote {
  let vote = Vote.load(id);

  if (vote == null && createIfNotFound) {
    vote = new Vote(id);

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
