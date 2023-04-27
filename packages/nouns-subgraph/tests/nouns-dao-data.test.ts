import {
  assert,
  clearStore,
  test,
  describe,
  beforeEach,
  afterEach,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import {
  ProposalCandidate,
  ProposalCandidateSignature,
  ProposalCandidateVersion,
} from '../src/types/schema';
import { handleProposalCandidateCreated, handleSignatureAdded } from '../src/nouns-dao-data';
import { createProposalCandidateCreatedEvent, createSignatureAddedEvent } from './utils';
import { BIGINT_ONE } from '../src/utils/constants';
import { getOrCreateDelegate } from '../src/utils/helpers';

const SOME_ADDRESS = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const proposerWithDelegate = Address.fromString('0x0000000000000000000000000000000000000001');
const candidateProposer = Address.fromString('0x0000000000000000000000000000000000000002');
const signerWithDelegate = Address.fromString('0x0000000000000000000000000000000000000003');

const txHash = Bytes.fromI32(11);
const logIndex = BigInt.fromI32(2);
const blockTimestamp = BigInt.fromI32(946684800);
const blockNumber = BigInt.fromI32(15537394);
const targets = [Address.fromString(SOME_ADDRESS)];
const values = [BigInt.fromI32(123)];
const signatures = ['some signature'];
const calldatas = [Bytes.fromI32(312)];
const description = '# Original Title\nOriginal body';
const title = 'Original Title';
const slug = 'some slug';
const encodedProposalHash = Bytes.fromI32(1234);

describe('nouns-dao-data', () => {
  beforeEach(() => {
    const proposerDelegate = getOrCreateDelegate(proposerWithDelegate.toHexString());
    proposerDelegate.tokenHoldersRepresentedAmount = 1;
    proposerDelegate.delegatedVotes = BIGINT_ONE;
    proposerDelegate.delegatedVotesRaw = BIGINT_ONE;
    proposerDelegate.save();

    const signerDelegate = getOrCreateDelegate(signerWithDelegate.toHexString());
    signerDelegate.tokenHoldersRepresentedAmount = 1;
    signerDelegate.delegatedVotes = BIGINT_ONE;
    signerDelegate.delegatedVotesRaw = BIGINT_ONE;
    signerDelegate.save();
  });

  afterEach(() => {
    clearStore();
  });

  describe('handleProposalCandidateCreated', () => {
    beforeEach(() => {
      const event = createProposalCandidateCreatedEvent(
        txHash,
        logIndex,
        blockTimestamp,
        blockNumber,
        candidateProposer,
        targets,
        values,
        signatures,
        calldatas,
        description,
        slug,
        encodedProposalHash,
      );
      handleProposalCandidateCreated(event);
    });

    test('happy flow saves a proposal candidate and a candidate version', () => {
      const candidate = ProposalCandidate.load(
        candidateProposer.toHexString().concat('-').concat(slug),
      )!;
      assert.stringEquals(candidateProposer.toHexString(), candidate.proposer.toHexString());
      assert.stringEquals(slug, candidate.slug);
      assert.bytesEquals(txHash, candidate.createdTransactionHash);
      assert.bigIntEquals(blockTimestamp, candidate.createdTimestamp);
      assert.bigIntEquals(blockNumber, candidate.createdBlock);

      const version = ProposalCandidateVersion.load(candidate.latestVersion!)!;
      assert.stringEquals(candidate.id, version.proposal);
      assert.bigIntEquals(blockTimestamp, version.createdTimestamp);
      assert.bigIntEquals(blockNumber, version.createdBlock);
      assert.bytesEquals(targets[0], version.targets![0]);
      assert.bigIntEquals(values[0], version.values![0]);
      assert.stringEquals(signatures[0], version.signatures![0]);
      assert.bytesEquals(calldatas[0], version.calldatas![0]);
      assert.stringEquals(description, version.description);
      assert.stringEquals(title, version.title);
      assert.bytesEquals(encodedProposalHash, version.encodedProposalHash);
      assert.stringEquals('', version.updateMessage);
    });

    test('add signature', () => {
      const sig = Bytes.fromHexString('0xdeadbeef');
      const expiry = BigInt.fromI32(1234);
      const reason = 'some reason';
      const sigDigest = Bytes.fromHexString('0xdeadbeefdeadbeef');

      const event = createSignatureAddedEvent(
        signerWithDelegate,
        sig,
        expiry,
        candidateProposer,
        slug,
        encodedProposalHash,
        sigDigest,
        reason,
      );

      handleSignatureAdded(event);

      const candidate = ProposalCandidate.load(
        candidateProposer.toHexString().concat('-').concat(slug),
      )!;

      const version = ProposalCandidateVersion.load(candidate.latestVersion!);
      assert.i32Equals(version!.versionSignatures.length, 1);
      assert.stringEquals(
        version!.versionSignatures[0],
        event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()),
      );

      const signature = ProposalCandidateSignature.load(version!.versionSignatures[0])!;
      assert.stringEquals(signature.signer, signerWithDelegate.toHexString());
      assert.bytesEquals(signature.sig, sig);
      assert.bigIntEquals(signature.expirationTimestamp, expiry);
      assert.bytesEquals(signature.encodedProposalHash, encodedProposalHash);
      assert.bytesEquals(signature.sigDigest, sigDigest);
      assert.stringEquals(signature.reason, reason);
    });

    test('skips signature if encodedProposalHash does not match latest version', () => {
      const sig = Bytes.fromHexString('0xdeadbeef');
      const expiry = BigInt.fromI32(1234);
      const reason = 'some reason';
      const sigDigest = Bytes.fromHexString('0xdeadbeefdeadbeef');
      const differentEncodedProposalHash = Bytes.fromI32(12345);

      const event = createSignatureAddedEvent(
        signerWithDelegate,
        sig,
        expiry,
        candidateProposer,
        slug,
        differentEncodedProposalHash,
        sigDigest,
        reason,
      );

      handleSignatureAdded(event);

      const candidate = ProposalCandidate.load(
        candidateProposer.toHexString().concat('-').concat(slug),
      )!;

      // check no signature was saved
      const signature = ProposalCandidateSignature.load(
        event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()),
      );
      assert.assertNull(signature);
    });
  });
});
