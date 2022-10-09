import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import {
  ProposalCreatedWithRequirements,
  ProposalCanceled,
  ProposalQueued,
  ProposalExecuted,
  VoteCast,
  ProposalVetoed,
  MinQuorumVotesBPSSet,
  MaxQuorumVotesBPSSet,
  QuorumCoefficientSet,
} from './types/NounsDAO/NounsDAO';
import {
  getOrCreateDelegate,
  getOrCreateProposal,
  getOrCreateVote,
  getGovernanceEntity,
  getOrCreateDelegateWithNullOption,
  getOrCreateDynamicQuorumParams,
} from './utils/helpers';
import {
  BIGINT_ONE,
  STATUS_ACTIVE,
  STATUS_QUEUED,
  STATUS_PENDING,
  STATUS_EXECUTED,
  STATUS_CANCELLED,
  STATUS_VETOED,
  BIGINT_ZERO,
} from './utils/constants';
import { dynamicQuorumVotes } from './utils/dynamicQuorum';

export function handleProposalCreatedWithRequirements(
  event: ProposalCreatedWithRequirements,
): void {
  let proposal = getOrCreateProposal(event.params.id.toString());
  let proposer = getOrCreateDelegateWithNullOption(event.params.proposer.toHexString(), false);

  // Check if the proposer was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to propose anything without first being 'created'
  if (proposer == null) {
    log.error('Delegate {} not found on ProposalCreated. tx_hash: {}', [
      event.params.proposer.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
  }
  // Create it anyway since we will want to account for this event data, even though it should've never happened
  proposer = getOrCreateDelegate(event.params.proposer.toHexString());
  proposal.proposer = proposer.id;
  proposal.targets = changetype<Bytes[]>(event.params.targets);
  proposal.values = event.params.values;
  proposal.signatures = event.params.signatures;
  proposal.calldatas = event.params.calldatas;
  proposal.createdTimestamp = event.block.timestamp;
  proposal.createdBlock = event.block.number;
  proposal.createdTransactionHash = event.transaction.hash;
  proposal.startBlock = event.params.startBlock;
  proposal.endBlock = event.params.endBlock;
  proposal.proposalThreshold = event.params.proposalThreshold;
  proposal.quorumVotes = event.params.quorumVotes;
  proposal.forVotes = BIGINT_ZERO;
  proposal.againstVotes = BIGINT_ZERO;
  proposal.abstainVotes = BIGINT_ZERO;
  proposal.description = event.params.description.split('\\n').join('\n'); // The Graph's AssemblyScript version does not support string.replace
  proposal.status = event.block.number >= proposal.startBlock ? STATUS_ACTIVE : STATUS_PENDING;

  // Storing state for dynamic quorum calculations
  // Doing these for V1 props as well to avoid making these fields optional + avoid missing required field warnings
  const governance = getGovernanceEntity();
  proposal.totalSupply = governance.totalTokenHolders;

  const dynamicQuorum = getOrCreateDynamicQuorumParams();
  proposal.minQuorumVotesBPS = dynamicQuorum.minQuorumVotesBPS;
  proposal.maxQuorumVotesBPS = dynamicQuorum.maxQuorumVotesBPS;
  proposal.quorumCoefficient = dynamicQuorum.quorumCoefficient;

  proposal.save();
}

export function handleProposalCanceled(event: ProposalCanceled): void {
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_CANCELLED;
  proposal.save();
}

export function handleProposalVetoed(event: ProposalVetoed): void {
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_VETOED;
  proposal.save();
}

export function handleProposalQueued(event: ProposalQueued): void {
  let governance = getGovernanceEntity();
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_QUEUED;
  proposal.executionETA = event.params.eta;
  proposal.save();

  governance.proposalsQueued = governance.proposalsQueued.plus(BIGINT_ONE);
  governance.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  let governance = getGovernanceEntity();
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_EXECUTED;
  proposal.executionETA = null;
  proposal.save();

  governance.proposalsQueued = governance.proposalsQueued.minus(BIGINT_ONE);
  governance.save();
}

export function handleVoteCast(event: VoteCast): void {
  let proposal = getOrCreateProposal(event.params.proposalId.toString());
  let voteId = event.params.voter
    .toHexString()
    .concat('-')
    .concat(event.params.proposalId.toString());
  let vote = getOrCreateVote(voteId);
  let voter = getOrCreateDelegateWithNullOption(event.params.voter.toHexString(), false);

  // Check if the voter was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to vote without first being 'created'
  if (voter == null) {
    log.error('Delegate {} not found on VoteCast. tx_hash: {}', [
      event.params.voter.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
  }

  // Create it anyway since we will want to account for this event data, even though it should've never happened
  voter = getOrCreateDelegate(event.params.voter.toHexString());

  vote.proposal = proposal.id;
  vote.voter = voter.id;
  vote.votesRaw = event.params.votes;
  vote.votes = event.params.votes;
  vote.support = event.params.support == 1;
  vote.supportDetailed = event.params.support;
  vote.nouns = voter.nounsRepresented;
  vote.blockNumber = event.block.number;

  if (event.params.reason != '') {
    vote.reason = event.params.reason;
  }

  vote.save();

  if (event.params.support == 0) {
    proposal.againstVotes = proposal.againstVotes.plus(event.params.votes);
  } else if (event.params.support == 1) {
    proposal.forVotes = proposal.forVotes.plus(event.params.votes);
  } else if (event.params.support == 2) {
    proposal.abstainVotes = proposal.abstainVotes.plus(event.params.votes);
  }

  const dqParams = getOrCreateDynamicQuorumParams();
  const usingDynamicQuorum =
    dqParams.dynamicQuorumStartBlock !== null &&
    dqParams.dynamicQuorumStartBlock!.lt(proposal.createdBlock);

  if (usingDynamicQuorum) {
    proposal.quorumVotes = dynamicQuorumVotes(
      proposal.againstVotes,
      proposal.totalSupply,
      proposal.minQuorumVotesBPS,
      proposal.maxQuorumVotesBPS,
      proposal.quorumCoefficient,
    );
  }

  if (proposal.status == STATUS_PENDING) {
    proposal.status = STATUS_ACTIVE;
  }
  proposal.save();
}

export function handleMinQuorumVotesBPSSet(event: MinQuorumVotesBPSSet): void {
  const params = getOrCreateDynamicQuorumParams(event.block.number);
  params.minQuorumVotesBPS = event.params.newMinQuorumVotesBPS;
  params.save();
}

export function handleMaxQuorumVotesBPSSet(event: MaxQuorumVotesBPSSet): void {
  const params = getOrCreateDynamicQuorumParams(event.block.number);
  params.maxQuorumVotesBPS = event.params.newMaxQuorumVotesBPS;
  params.save();
}

export function handleQuorumCoefficientSet(event: QuorumCoefficientSet): void {
  const params = getOrCreateDynamicQuorumParams(event.block.number);
  params.quorumCoefficient = event.params.newQuorumCoefficient;
  params.save();
}
