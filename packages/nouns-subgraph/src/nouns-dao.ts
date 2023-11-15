import { Bytes, log, ethereum, store, BigInt } from '@graphprotocol/graph-ts';
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
  ProposalDescriptionUpdated,
  ProposalTransactionsUpdated,
  SignatureCancelled,
  EscrowedToFork,
  WithdrawFromForkEscrow,
  ExecuteFork,
  JoinFork,
  ProposalCreatedOnTimelockV1,
  VoteSnapshotBlockSwitchProposalIdSet,
} from './types/NounsDAO/NounsDAO';
import {
  getOrCreateDelegate,
  getOrCreateProposal,
  getOrCreateVote,
  getGovernanceEntity,
  getOrCreateDelegateWithNullOption,
  getOrCreateDynamicQuorumParams,
  getOrCreateProposalVersion,
  getOrCreateFork,
  calcEncodedProposalHash,
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
import {
  Proposal,
  ProposalCandidateSignature,
  EscrowDeposit,
  EscrowWithdrawal,
  ForkJoin,
  ForkJoinedNoun,
  EscrowedNoun,
  ProposalCandidateContent,
} from './types/schema';

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

export function handleProposalCreatedOnTimelockV1(event: ProposalCreatedOnTimelockV1): void {
  let proposal = getOrCreateProposal(event.params.id.toString());
  proposal.onTimelockV1 = true;
  proposal.save();
}

export function handleProposalCreated(parsedProposal: ParsedProposalV3): void {
  let proposal = getOrCreateProposal(parsedProposal.id);
  let proposerResult = getOrCreateDelegateWithNullOption(parsedProposal.proposer);

  // Check if the proposer was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to propose anything without first being 'created'
  if (proposerResult.created && parsedProposal.signers.length == 0) {
    log.error('Delegate {} not found on ProposalCreated. tx_hash: {}', [
      parsedProposal.proposer,
      parsedProposal.txHash,
    ]);
  }

  // Create it anyway, which supports V3 cases of proposers not having any Nouns
  proposal.proposer = proposerResult.entity!.id;
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
  proposal.updatePeriodEndBlock = parsedProposal.updatePeriodEndBlock;
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
    const signerDelegateResult = getOrCreateDelegateWithNullOption(signerAddress);
    if (signerDelegateResult.created) {
      log.error('Signer delegate {} not found on ProposalCreated. tx_hash: {}', [
        signerAddress,
        parsedProposal.txHash,
      ]);
    }
    signerDelegates[i] = signerDelegateResult.entity!.id;
  }
  proposal.signers = signerDelegates;

  // Storing state for dynamic quorum calculations
  // Doing these for V1 props as well to avoid making these fields optional + avoid missing required field warnings
  const governance = getGovernanceEntity();
  proposal.totalSupply = governance.totalTokenHolders;
  if (parsedProposal.adjustedTotalSupply.equals(BIGINT_ZERO)) {
    proposal.adjustedTotalSupply = proposal.totalSupply;
  } else {
    proposal.adjustedTotalSupply = parsedProposal.adjustedTotalSupply;
  }

  if (
    governance.voteSnapshotBlockSwitchProposalId.equals(BIGINT_ZERO) ||
    BigInt.fromString(proposal.id).lt(governance.voteSnapshotBlockSwitchProposalId)
  ) {
    proposal.voteSnapshotBlock = proposal.createdBlock;
  } else {
    proposal.voteSnapshotBlock = proposal.startBlock;
  }

  const dynamicQuorum = getOrCreateDynamicQuorumParams();
  proposal.minQuorumVotesBPS = dynamicQuorum.minQuorumVotesBPS;
  proposal.maxQuorumVotesBPS = dynamicQuorum.maxQuorumVotesBPS;
  proposal.quorumCoefficient = dynamicQuorum.quorumCoefficient;

  proposal.save();

  captureProposalVersion(parsedProposal.txHash, parsedProposal.logIndex, proposal, false);
}

export function handleProposalUpdated(event: ProposalUpdated): void {
  const proposal = getOrCreateProposal(event.params.id.toString());

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

  captureProposalVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    proposal,
    true,
    event.params.updateMessage,
  );
}

export function handleProposalDescriptionUpdated(event: ProposalDescriptionUpdated): void {
  const proposal = getOrCreateProposal(event.params.id.toString());

  proposal.lastUpdatedTimestamp = event.block.timestamp;
  proposal.lastUpdatedBlock = event.block.number;
  proposal.description = event.params.description.split('\\n').join('\n');
  proposal.title = extractTitle(proposal.description);
  proposal.save();

  captureProposalVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    proposal,
    true,
    event.params.updateMessage,
  );
}

export function handleProposalTransactionsUpdated(event: ProposalTransactionsUpdated): void {
  const proposal = getOrCreateProposal(event.params.id.toString());

  proposal.lastUpdatedTimestamp = event.block.timestamp;
  proposal.lastUpdatedBlock = event.block.number;
  proposal.targets = changetype<Bytes[]>(event.params.targets);
  proposal.values = event.params.values;
  proposal.signatures = event.params.signatures;
  proposal.calldatas = event.params.calldatas;
  proposal.save();

  captureProposalVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    proposal,
    true,
    event.params.updateMessage,
  );
}

export function handleProposalCanceled(event: ProposalCanceled): void {
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_CANCELLED;
  proposal.canceledBlock = event.block.number;
  proposal.canceledTimestamp = event.block.timestamp;
  proposal.save();
}

export function handleProposalVetoed(event: ProposalVetoed): void {
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_VETOED;
  proposal.vetoedBlock = event.block.number;
  proposal.vetoedTimestamp = event.block.timestamp;
  proposal.save();
}

export function handleProposalQueued(event: ProposalQueued): void {
  let governance = getGovernanceEntity();
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_QUEUED;
  proposal.executionETA = event.params.eta;
  proposal.queuedBlock = event.block.number;
  proposal.queuedTimestamp = event.block.timestamp;
  proposal.save();

  governance.proposalsQueued = governance.proposalsQueued.plus(BIGINT_ONE);
  governance.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  let governance = getGovernanceEntity();
  let proposal = getOrCreateProposal(event.params.id.toString());

  proposal.status = STATUS_EXECUTED;
  proposal.executionETA = null;
  proposal.executedBlock = event.block.number;
  proposal.executedTimestamp = event.block.timestamp;
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
  let voterResult = getOrCreateDelegateWithNullOption(event.params.voter.toHexString());

  // Check if the voter was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to vote without first being 'created'
  if (voterResult.created) {
    log.error('Delegate {} not found on VoteCast. tx_hash: {}', [
      event.params.voter.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
  }

  // Create it anyway since we will want to account for this event data, even though it should've never happened
  const voter = voterResult.entity!;
  vote.proposal = proposal.id;
  vote.voter = voter.id;
  vote.votesRaw = event.params.votes;
  vote.votes = event.params.votes;
  vote.support = event.params.support == 1;
  vote.supportDetailed = event.params.support;
  vote.nouns = voter.nounsRepresented;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;

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
      proposal.adjustedTotalSupply,
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

export function handleSignatureCanceled(event: SignatureCancelled): void {
  const sigId = event.params.signer
    .toHexString()
    .concat('-')
    .concat(event.params.sig.toHexString());
  const sig = ProposalCandidateSignature.load(sigId);

  if (sig == null) {
    log.error('[handleSignatureCanceled] Sig {} not found. Hash: {}', [
      sigId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  sig.canceled = true;
  sig.save();
}

function captureProposalVersion(
  txHash: string,
  logIndex: string,
  proposal: Proposal,
  isUpdate: boolean,
  updateMessage: string = '',
): void {
  const versionId = txHash.concat('-').concat(logIndex);
  const previousVersion = getOrCreateProposalVersion(versionId);
  previousVersion.proposal = proposal.id;
  previousVersion.createdBlock = proposal.lastUpdatedBlock;
  previousVersion.createdAt = proposal.lastUpdatedTimestamp;
  previousVersion.targets = proposal.targets;
  previousVersion.values = proposal.values;
  previousVersion.signatures = proposal.signatures;
  previousVersion.calldatas = proposal.calldatas;
  previousVersion.title = proposal.title;
  previousVersion.description = proposal.description;
  previousVersion.updateMessage = updateMessage;
  previousVersion.save();

  markProposalCandidateIfExists(proposal, isUpdate);
}

function markProposalCandidateIfExists(proposal: Proposal, isUpdate: boolean): void {
  const hash = calcEncodedProposalHash(proposal, isUpdate);
  const candidate = ProposalCandidateContent.load(hash.toHexString());
  if (candidate !== null) {
    const ids = candidate.matchingProposalIds || [];
    candidate.matchingProposalIds = ids!.concat([BigInt.fromString(proposal.id)]);
    candidate.save();
  }
}

export function handleEscrowedToFork(event: EscrowedToFork): void {
  const fork = getOrCreateFork(event.params.forkId);

  const deposit = new EscrowDeposit(genericUniqueId(event));
  deposit.fork = fork.id;
  deposit.createdAt = event.block.timestamp;
  deposit.owner = getOrCreateDelegate(event.params.owner.toHexString()).id;
  deposit.tokenIDs = event.params.tokenIds;
  deposit.proposalIDs = event.params.proposalIds;
  deposit.reason = event.params.reason;
  deposit.save();

  fork.tokensInEscrowCount += event.params.tokenIds.length;
  // Add escrowed Nouns to the list of Nouns connected to their escrow event
  // Using an entity rather than just Noun IDs thinking it's helpful in creating the UI timeline view
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    const id = fork.id.toString().concat('-').concat(event.params.tokenIds[i].toString());
    const noun = new EscrowedNoun(id);
    noun.fork = fork.id;
    noun.noun = event.params.tokenIds[i].toString();
    noun.owner = deposit.owner;
    noun.escrowDeposit = deposit.id;
    noun.save();
  }

  fork.save();
}

export function handleWithdrawFromForkEscrow(event: WithdrawFromForkEscrow): void {
  const fork = getOrCreateFork(event.params.forkId);

  const withdrawal = new EscrowWithdrawal(genericUniqueId(event));
  withdrawal.fork = fork.id;
  withdrawal.createdAt = event.block.timestamp;
  withdrawal.owner = getOrCreateDelegate(event.params.owner.toHexString()).id;
  withdrawal.tokenIDs = event.params.tokenIds;
  withdrawal.save();

  fork.tokensInEscrowCount -= event.params.tokenIds.length;

  // Remove escrowed Nouns from the list
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    const id = fork.id.toString().concat('-').concat(event.params.tokenIds[i].toString());
    store.remove('EscrowedNoun', id);
  }

  fork.save();
}

export function handleExecuteFork(event: ExecuteFork): void {
  const fork = getOrCreateFork(event.params.forkId);

  fork.executed = true;
  fork.executedAt = event.block.timestamp;
  fork.forkingPeriodEndTimestamp = event.params.forkEndTimestamp;
  fork.forkTreasury = event.params.forkTreasury;
  fork.forkToken = event.params.forkToken;

  if (fork.tokensInEscrowCount != event.params.tokensInEscrow.toI32()) {
    log.warning('Number of tokens in escrow mismatch. Indexed count: {} vs Event count: {}', [
      fork.tokensInEscrowCount.toString(),
      event.params.tokensInEscrow.toString(),
    ]);
    fork.tokensInEscrowCount = event.params.tokensInEscrow.toI32();
  }
  fork.tokensForkingCount = fork.tokensInEscrowCount;

  fork.save();
}

export function handleJoinFork(event: JoinFork): void {
  const fork = getOrCreateFork(event.params.forkId);

  const join = new ForkJoin(genericUniqueId(event));
  join.fork = fork.id;
  join.createdAt = event.block.timestamp;
  join.owner = getOrCreateDelegate(event.params.owner.toHexString()).id;
  join.tokenIDs = event.params.tokenIds;
  join.proposalIDs = event.params.proposalIds;
  join.reason = event.params.reason;
  join.save();

  fork.tokensForkingCount += event.params.tokenIds.length;

  // Add newly joined Nouns to the list of joined Nouns
  // Using an entity rather than just Noun IDs thinking it's helpful in creating the UI timeline view
  for (let i = 0; i < event.params.tokenIds.length; i++) {
    const id = fork.id.toString().concat('-').concat(event.params.tokenIds[i].toString());
    const noun = new ForkJoinedNoun(id);
    noun.fork = fork.id;
    noun.noun = event.params.tokenIds[i].toString();
    noun.owner = join.owner;
    noun.forkJoin = join.id;
    noun.save();
  }

  fork.save();
}

export function handleVoteSnapshotBlockSwitchProposalIdSet(
  event: VoteSnapshotBlockSwitchProposalIdSet,
): void {
  const governance = getGovernanceEntity();
  governance.voteSnapshotBlockSwitchProposalId = event.params.newVoteSnapshotBlockSwitchProposalId;
  governance.save();
}

function genericUniqueId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
}
