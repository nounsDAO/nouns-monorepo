import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import {
  ProposalCreatedWithRequirements,
  ProposalCanceled,
  ProposalQueued,
  ProposalExecuted,
  VoteCast,
  ProposalVetoed,
  DynamicQuorumParamsSet,
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
  proposal.startBlock = event.params.startBlock;
  proposal.endBlock = event.params.endBlock;
  proposal.proposalThreshold = event.params.proposalThreshold;
  proposal.quorumVotes = event.params.quorumVotes;
  proposal.description = event.params.description.split('\\n').join('\n'); // The Graph's AssemblyScript version does not support string.replace
  proposal.status = event.block.number >= proposal.startBlock ? STATUS_ACTIVE : STATUS_PENDING;
  proposal.usingDynamicQuorum = event.params.quorumVotes.equals(BIGINT_ZERO);

  // Storing state for dynamic quorum calculations
  // Doing these for V1 props as well to avoid making these fields optional + avoid missing required field warnings
  const governance = getGovernanceEntity();
  proposal.totalSupply = governance.totalTokenHolders;
  proposal.againstVotes = 0;

  const dynamicQuorum = getOrCreateDynamicQuorumParams();
  proposal.minQuorumVotesBPS = dynamicQuorum.minQuorumVotesBPS;
  proposal.maxQuorumVotesBPS = dynamicQuorum.maxQuorumVotesBPS;
  proposal.quorumVotesBPSOffset = dynamicQuorum.quorumVotesBPSOffset;
  proposal.quorumLinearCoef = dynamicQuorum.quorumLinearCoef;
  proposal.quorumQuadraticCoef = dynamicQuorum.quorumQuadraticCoef;

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

  if (event.params.reason != '') {
    vote.reason = event.params.reason;
  }

  vote.save();

  let shouldSaveProp = false;

  if (event.params.support == 0) {
    shouldSaveProp = true;
    proposal.againstVotes = proposal.againstVotes + event.params.votes.toI32();
  }

  if (proposal.usingDynamicQuorum) {
    shouldSaveProp = true;

    proposal.quorumVotes = dynamicQuorumVotes(
      proposal.againstVotes,
      proposal.totalSupply,
      proposal.minQuorumVotesBPS,
      proposal.maxQuorumVotesBPS,
      proposal.quorumVotesBPSOffset,
      proposal.quorumLinearCoef,
      proposal.quorumQuadraticCoef,
    );
  }

  if (proposal.status == STATUS_PENDING) {
    shouldSaveProp = true;
    proposal.status = STATUS_ACTIVE;
  }

  if (shouldSaveProp) {
    proposal.save();
  }
}

export function handleDynamicQuorumParamsSet(event: DynamicQuorumParamsSet): void {
  const params = getOrCreateDynamicQuorumParams();

  params.minQuorumVotesBPS = event.params.minQuorumVotesBPS;
  params.maxQuorumVotesBPS = event.params.maxQuorumVotesBPS;
  params.quorumVotesBPSOffset = event.params.quorumVotesBPSOffset;
  params.quorumLinearCoef = event.params.quorumLinearCoef;
  params.quorumQuadraticCoef = event.params.quorumQuadraticCoef;

  params.save();
}
