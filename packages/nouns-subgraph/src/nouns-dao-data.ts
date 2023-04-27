import { Bytes, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { extractTitle } from './custom-types/ParsedProposalV3';
import {
  FeedbackSent,
  ProposalCandidateCanceled,
  ProposalCandidateCreated,
  ProposalCandidateUpdated,
  SignatureAdded,
} from './types/NounsDAOData/NounsDAOData';
import { ProposalCandidate, ProposalCandidateVersion } from './types/schema';
import {
  getOrCreateDelegate,
  getOrCreateProposalCandidate,
  getOrCreateProposalCandidateSignature,
  getOrCreateProposalCandidateVersion,
  getOrCreateProposalFeedback,
} from './utils/helpers';

export function handleProposalCandidateCreated(event: ProposalCandidateCreated): void {
  const id = event.params.msgSender.toHexString().concat('-').concat(event.params.slug);
  const candidate = getOrCreateProposalCandidate(id);

  candidate.proposer = event.params.msgSender;
  candidate.slug = event.params.slug;
  candidate.createdTransactionHash = event.transaction.hash;
  candidate.createdTimestamp = event.block.timestamp;
  candidate.createdBlock = event.block.number;
  candidate.lastUpdatedTimestamp = event.block.timestamp;
  candidate.lastUpdatedBlock = event.block.number;
  candidate.canceled = false;

  const version = captureProposalCandidateVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    candidate.id,
    changetype<Bytes[]>(event.params.targets),
    event.params.values,
    event.params.signatures,
    event.params.calldatas,
    event.params.description,
    event.params.encodedProposalHash,
    event.block,
  );

  candidate.latestVersion = version.id;
  candidate.save();
}

export function handleProposalCandidateUpdated(event: ProposalCandidateUpdated): void {
  const candidateId = event.params.msgSender.toHexString().concat('-').concat(event.params.slug);
  const candidate = getOrCreateProposalCandidate(candidateId);

  candidate.lastUpdatedTimestamp = event.block.timestamp;
  candidate.lastUpdatedBlock = event.block.number;

  const version = captureProposalCandidateVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    candidate.id,
    changetype<Bytes[]>(event.params.targets),
    event.params.values,
    event.params.signatures,
    event.params.calldatas,
    event.params.description,
    event.params.encodedProposalHash,
    event.block,
    event.params.reason,
  );

  candidate.latestVersion = version.id;
  candidate.save();
}

export function handleProposalCandidateCanceled(event: ProposalCandidateCanceled): void {
  const candidateId = event.params.msgSender.toHexString().concat('-').concat(event.params.slug);
  const candidate = getOrCreateProposalCandidate(candidateId);

  candidate.canceled = true;
  candidate.canceledTimestamp = event.block.timestamp;
  candidate.canceledBlock = event.block.number;

  candidate.save();
}

export function handleSignatureAdded(event: SignatureAdded): void {
  const sigId = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
  const candidateSig = getOrCreateProposalCandidateSignature(sigId);
  const candidateId = event.params.proposer.toHexString().concat('-').concat(event.params.slug);
  const candidate = getOrCreateProposalCandidate(candidateId);

  const latestVersion = ProposalCandidateVersion.load(candidate.latestVersion!)!;
  if (latestVersion.encodedProposalHash != event.params.encodedPropHash) {
    log.error('Wrong encodedProposalHash. Latest version: {}. Event: {}. tx_hash: {}', [
      latestVersion.encodedProposalHash.toHexString(),
      event.params.encodedPropHash.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  candidateSig.version = candidate.latestVersion!;
  candidateSig.signer = getOrCreateDelegate(event.params.signer.toHexString()).id;
  candidateSig.sig = event.params.sig;
  candidateSig.expirationTimestamp = event.params.expirationTimestamp;
  candidateSig.encodedProposalHash = event.params.encodedPropHash;
  candidateSig.sigDigest = event.params.sigDigest;
  candidateSig.reason = event.params.reason;

  candidateSig.save();
}

export function handleFeedbackSent(event: FeedbackSent): void {
  const id = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
  const feedback = getOrCreateProposalFeedback(id);

  feedback.createdTimestamp = event.block.timestamp;
  feedback.createdBlock = event.block.number;
  feedback.proposal = event.params.proposalId.toString();
  feedback.voter = getOrCreateDelegate(event.params.msgSender.toHexString()).id;
  feedback.supportDetailed = event.params.support;
  feedback.votes = event.params.votes;
  feedback.reason = event.params.reason;

  feedback.save();
}

function captureProposalCandidateVersion(
  txHash: string,
  logIndex: string,
  candidateId: string,
  targets: Bytes[],
  values: BigInt[],
  signatures: string[],
  calldatas: Bytes[],
  description: string,
  encodedProposalHash: Bytes,
  block: ethereum.Block,
  updateMessage: string = '',
): ProposalCandidateVersion {
  const versionId = txHash.concat('-').concat(logIndex);
  const version = getOrCreateProposalCandidateVersion(versionId);
  version.proposal = candidateId;
  version.createdTimestamp = block.timestamp;
  version.createdBlock = block.number;
  version.targets = targets;
  version.values = values;
  version.signatures = signatures;
  version.calldatas = calldatas;
  version.description = description.split('\\n').join('\n');
  version.title = extractTitle(description);
  version.encodedProposalHash = encodedProposalHash;
  version.updateMessage = updateMessage;
  version.save();

  return version;
}

function getMatchingCandidateVersion(
  versionIds: string[],
  encodedPropHash: Bytes,
): ProposalCandidateVersion | null {
  for (let i = 0; i < versionIds.length; i++) {
    const versionId = versionIds[i];
    const version = getOrCreateProposalCandidateVersion(versionId);
    if (encodedPropHash == version.encodedProposalHash) {
      return version;
    }
  }
  return null;
}
