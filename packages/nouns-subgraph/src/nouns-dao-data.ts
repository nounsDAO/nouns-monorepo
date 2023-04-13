import { Bytes, log } from '@graphprotocol/graph-ts';
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
  candidate.targets = changetype<Bytes[]>(event.params.targets);
  candidate.values = event.params.values;
  candidate.signatures = event.params.signatures;
  candidate.calldatas = event.params.calldatas;
  candidate.description = event.params.description.split('\\n').join('\n');
  candidate.title = extractTitle(candidate.description);
  candidate.encodedProposalHash = event.params.encodedProposalHash;
  candidate.createdTransactionHash = event.transaction.hash;
  candidate.createdTimestamp = event.block.timestamp;
  candidate.createdBlock = event.block.number;
  candidate.lastUpdatedTimestamp = event.block.timestamp;
  candidate.lastUpdatedBlock = event.block.number;

  candidate.save();

  captureProposalCandidateVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    candidate,
  );
}

export function handleProposalCandidateUpdated(event: ProposalCandidateUpdated): void {
  const candidateId = event.params.msgSender.toHexString().concat('-').concat(event.params.slug);
  const candidate = getOrCreateProposalCandidate(candidateId);

  candidate.targets = changetype<Bytes[]>(event.params.targets);
  candidate.values = event.params.values;
  candidate.signatures = event.params.signatures;
  candidate.calldatas = event.params.calldatas;
  candidate.description = event.params.description.split('\\n').join('\n');
  candidate.title = extractTitle(candidate.description);
  candidate.encodedProposalHash = event.params.encodedProposalHash;
  candidate.lastUpdatedTimestamp = event.block.timestamp;
  candidate.lastUpdatedBlock = event.block.number;
  candidate.save();

  captureProposalCandidateVersion(
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
    candidate,
    event.params.reason,
  );
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
  const signedVersion = getMatchingCandidateVersion(
    candidate.versions,
    event.params.encodedPropHash,
  );
  if (signedVersion == null) {
    log.error('Candidate version not found. Encoded proposal hash: {}. tx_hash: {}', [
      event.params.encodedPropHash.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  candidateSig.version = signedVersion.id;
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
  candidate: ProposalCandidate,
  updateMessage: string = '',
): void {
  const versionId = txHash.concat('-').concat(logIndex);
  const version = getOrCreateProposalCandidateVersion(versionId);
  version.proposal = candidate.id;
  version.createdTimestamp = candidate.lastUpdatedTimestamp;
  version.createdBlock = candidate.lastUpdatedBlock;
  version.targets = candidate.targets;
  version.values = candidate.values;
  version.signatures = candidate.signatures;
  version.calldatas = candidate.calldatas;
  version.description = candidate.description;
  version.title = candidate.title;
  version.encodedProposalHash = candidate.encodedProposalHash;
  version.updateMessage = updateMessage;
  version.save();
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
