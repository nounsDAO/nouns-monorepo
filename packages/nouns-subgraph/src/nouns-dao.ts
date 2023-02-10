import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import {
  ProposalCreatedWithRequirements,
  ProposalCreatedWithRequirements1,
  ProposalCanceled,
  ProposalQueued,
  ProposalExecuted,
  VoteCast,
  ProposalVetoed,
  MinQuorumVotesBPSSet,
  MaxQuorumVotesBPSSet,
  QuorumCoefficientSet,
  ProposalUpdated,
  ProposalObjectionPeriodSet,
} from './types/NounsDAO/NounsDAO';
import {
  getOrCreateDelegate,
  getOrCreateProposal,
  getOrCreateVote,
  getGovernanceEntity,
  getOrCreateDelegateWithNullOption,
  getOrCreateDynamicQuorumParams,
  getOrCreateProposalPreviousVersion,
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
import { ParsedProposalV3, extractTitle } from './custom-types/ParsedProposalV3';

export function handleProposalCreatedWithRequirements(
  event: ProposalCreatedWithRequirements1,
): void {
  handleProposalCreated(ParsedProposalV3.fromV1Event(event));
}

export function handleProposalCreatedWithRequirementsV3(
  event: ProposalCreatedWithRequirements,
): void {
  handleProposalCreated(ParsedProposalV3.fromV3Event(event));
}

export function handleProposalCreated(parsedProposal: ParsedProposalV3): void {
  let proposal = getOrCreateProposal(parsedProposal.id);
  let proposer = getOrCreateDelegateWithNullOption(parsedProposal.proposer, false);

  // Check if the proposer was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to propose anything without first being 'created'
  if (proposer == null && parsedProposal.signers.length == 0) {
    log.error('Delegate {} not found on ProposalCreated. tx_hash: {}', [
      parsedProposal.proposer,
      parsedProposal.txHash,
    ]);
  }

  // Create it anyway, which supports V3 cases of proposers not having any Nouns
  proposer = getOrCreateDelegate(parsedProposal.proposer);
  proposal.proposer = proposer.id;
  proposal.targets = parsedProposal.targets;
  proposal.values = parsedProposal.values;
  proposal.signatures = parsedProposal.signatures;
  proposal.calldatas = parsedProposal.calldatas;
  proposal.createdTimestamp = parsedProposal.createdTimestamp;
  proposal.createdBlock = parsedProposal.createdBlock;
  proposal.lastUpdatedTimestamp = parsedProposal.createdTimestamp;
  proposal.lastUpdatedBlock = parsedProposal.createdBlock;
  proposal.createdTransactionHash = parsedProposal.createdTransactionHash;
  proposal.startBlock = parsedProposal.startBlock;
  proposal.endBlock = parsedProposal.endBlock;
  proposal.proposalThreshold = parsedProposal.proposalThreshold;
  proposal.quorumVotes = parsedProposal.quorumVotes;
  proposal.forVotes = BIGINT_ZERO;
  proposal.againstVotes = BIGINT_ZERO;
  proposal.abstainVotes = BIGINT_ZERO;
  proposal.description = parsedProposal.description;
  proposal.title = parsedProposal.title;
  proposal.status = parsedProposal.status;
  proposal.objectionPeriodEndBlock = BIGINT_ZERO;

  const signerDelegates = new Array<string>(parsedProposal.signers.length);
  for (let i = 0; i < parsedProposal.signers.length; i++) {
    const signerAddress = parsedProposal.signers[i];
    let signerDelegate = getOrCreateDelegateWithNullOption(signerAddress, false);
    if (signerDelegate == null) {
      log.error('Signer delegate {} not found on ProposalCreated. tx_hash: {}', [
        signerAddress,
        parsedProposal.txHash,
      ]);
      signerDelegate = getOrCreateDelegate(signerAddress);
    }

    signerDelegates[i] = signerDelegate.id;
  }
  proposal.signers = signerDelegates;

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

export function handleProposalUpdated(event: ProposalUpdated): void {
  const updateId = event.params.id
    .toString()
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(event.logIndex.toString());

  const previousVersion = getOrCreateProposalPreviousVersion(updateId);
  const proposal = getOrCreateProposal(event.params.id.toString());

  // First save the current state of the proposal to the previous version
  previousVersion.proposal = proposal.id;
  previousVersion.createdAt = proposal.lastUpdatedTimestamp;
  previousVersion.targets = proposal.targets;
  previousVersion.values = proposal.values;
  previousVersion.signatures = proposal.signatures;
  previousVersion.calldatas = proposal.calldatas;
  previousVersion.title = proposal.title;
  previousVersion.description = proposal.description;
  previousVersion.save();

  // Then update the proposal to the latest state
  proposal.lastUpdatedTimestamp = event.block.timestamp;
  proposal.lastUpdatedBlock = event.block.number;
  proposal.targets = changetype<Bytes[]>(event.params.targets);
  proposal.values = event.params.values;
  proposal.signatures = event.params.signatures;
  proposal.calldatas = event.params.calldatas;
  proposal.description = event.params.description.split('\\n').join('\n');
  proposal.title = extractTitle(proposal.description);
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

export function handleProposalObjectionPeriodSet(event: ProposalObjectionPeriodSet): void {
  const proposal = getOrCreateProposal(event.params.id.toString());
  proposal.objectionPeriodEndBlock = event.params.objectionPeriodEndBlock;
  proposal.save();
}
