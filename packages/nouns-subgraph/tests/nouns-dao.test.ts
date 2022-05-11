import { assert, clearStore, test } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ByteArray } from '@graphprotocol/graph-ts';
import { Proposal } from '../src/types/schema';
import {
  handleProposalCreatedWithRequirements,
  handleVoteCast,
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumVotesBPSOffsetSet,
  handleQuorumLinearCoefficientSet,
  handleQuorumQuadraticCoefficientSet,
} from '../src/nouns-dao';
import {
  createProposalCreatedWithRequirementsEvent,
  createVoteCastEvent,
  stubProposalCreatedWithRequirementsEventInput,
  createMinQuorumVotesBPSSetEvent,
  createMaxQuorumVotesBPSSetEvent,
  createQuorumVotesBPSOffsetSetEvent,
  createQuorumLinearCoefficientSetEvent,
  createQuorumQuadraticCoefficientSetEvent,
  handleAllQuorumParamEvents,
} from './utils';
import {
  BIGINT_10K,
  BIGINT_ONE,
  BIGINT_ZERO,
  STATUS_ACTIVE,
  STATUS_PENDING,
} from '../src/utils/constants';
import {
  getOrCreateDynamicQuorumParams,
  getGovernanceEntity,
  getOrCreateDelegate,
} from '../src/utils/helpers';

const SOME_ADDRESS = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

test('handleProposalCreatedWithRequirements: saved PENDING proposal as expected', () => {
  // this is to prevent a log error in the code under test that expects there to be a delegate
  // which makes sense - we should have recorded the person's voting power prior to their prop
  getOrCreateDelegate(SOME_ADDRESS);

  const startBlock = BigInt.fromI32(3);
  const endBlock = BigInt.fromI32(103);
  const eventBlockNumber = BigInt.fromI32(2);

  const newEvent = createProposalCreatedWithRequirementsEvent({
    id: BigInt.fromI32(1),
    proposer: Address.fromString(SOME_ADDRESS),
    targets: [Address.fromString('0x000000000000000000000000000000000000dEaD')],
    values: [BigInt.fromI32(0)],
    signatures: ['some signature'],
    calldatas: [changetype<Bytes>(ByteArray.fromBigInt(BIGINT_ONE))],
    startBlock,
    endBlock,
    proposalThreshold: BIGINT_ONE,
    quorumVotes: BIGINT_ONE,
    description: 'some description',
    eventBlockNumber,
  });

  handleProposalCreatedWithRequirements(newEvent);

  const savedProp = Proposal.load(newEvent.params.id.toString());

  assert.stringEquals(savedProp!.proposer, SOME_ADDRESS.toLowerCase());
  assert.stringEquals(savedProp!.status, STATUS_PENDING);

  clearStore();
});

test('handleProposalCreatedWithRequirements: saved ACTIVE proposal as expected', () => {
  getOrCreateDelegate(SOME_ADDRESS);

  const startBlock = BigInt.fromI32(3);
  const endBlock = BigInt.fromI32(103);
  const eventBlockNumber = BigInt.fromI32(4);

  const newEvent = createProposalCreatedWithRequirementsEvent({
    id: BigInt.fromI32(1),
    proposer: Address.fromString(SOME_ADDRESS),
    targets: [Address.fromString('0x000000000000000000000000000000000000dEaD')],
    values: [BigInt.fromI32(0)],
    signatures: ['some signature'],
    calldatas: [changetype<Bytes>(ByteArray.fromBigInt(BIGINT_ONE))],
    startBlock,
    endBlock,
    proposalThreshold: BIGINT_ONE,
    quorumVotes: BIGINT_ONE,
    description: 'some description',
    eventBlockNumber,
  });

  handleProposalCreatedWithRequirements(newEvent);

  const savedProp = Proposal.load(newEvent.params.id.toString());

  assert.stringEquals(savedProp!.proposer, SOME_ADDRESS.toLowerCase());
  assert.stringEquals(savedProp!.status, STATUS_ACTIVE);

  clearStore();
});

test('handleProposalCreatedWithRequirements: marks prop as not using dynamic quorum (V1) when quorumVotes is not zero', () => {
  getOrCreateDelegate(SOME_ADDRESS);

  const eventInput = stubProposalCreatedWithRequirementsEventInput();
  eventInput.quorumVotes = BIGINT_ONE;
  const newEvent = createProposalCreatedWithRequirementsEvent(eventInput);

  handleProposalCreatedWithRequirements(newEvent);

  const savedProp = Proposal.load(newEvent.params.id.toString());

  assert.booleanEquals(savedProp!.usingDynamicQuorum, false);

  clearStore();
});

test('handleProposalCreatedWithRequirements: marks prop as using dynamic quorum (V2) when quorumVotes is zero AND sets againstVotes to zero', () => {
  getOrCreateDelegate(SOME_ADDRESS);

  const eventInput = stubProposalCreatedWithRequirementsEventInput();
  eventInput.quorumVotes = BIGINT_ZERO;
  const newEvent = createProposalCreatedWithRequirementsEvent(eventInput);

  handleProposalCreatedWithRequirements(newEvent);

  const savedProp = Proposal.load(newEvent.params.id.toString());

  assert.booleanEquals(savedProp!.usingDynamicQuorum, true);
  assert.i32Equals(0, savedProp!.againstVotes);

  clearStore();
});

test('handleProposalCreatedWithRequirements: sets againstVotes to zero and totalSupply to its current value', () => {
  getOrCreateDelegate(SOME_ADDRESS);
  const totalSupply = BigInt.fromI32(123);

  const governance = getGovernanceEntity();
  governance.totalTokenHolders = totalSupply;
  governance.save();

  const eventInput = stubProposalCreatedWithRequirementsEventInput();
  eventInput.quorumVotes = BIGINT_ZERO;
  const newEvent = createProposalCreatedWithRequirementsEvent(eventInput);

  handleProposalCreatedWithRequirements(newEvent);

  const savedProp = Proposal.load(newEvent.params.id.toString());

  assert.i32Equals(0, savedProp!.againstVotes);
  assert.bigIntEquals(totalSupply, savedProp!.totalSupply);

  clearStore();
});

test('handleVoteCast: updates quorumVotes using dynamic quorum math', () => {
  getOrCreateDelegate(SOME_ADDRESS);
  const totalSupply = BigInt.fromI32(200);

  // Set total supply
  const governance = getGovernanceEntity();
  governance.totalTokenHolders = totalSupply;
  governance.save();

  // Save dynamic quorum params
  const linearCoefficient = BigInt.fromI32(300000);
  const quadraticCoefficient = BigInt.fromI32(1000);
  handleAllQuorumParamEvents(1000, 4000, 500, linearCoefficient, quadraticCoefficient);

  // Create prop with state we need for quorum inputs
  const propEventInput = stubProposalCreatedWithRequirementsEventInput();
  propEventInput.quorumVotes = BIGINT_ZERO;
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);
  handleProposalCreatedWithRequirements(newPropEvent);

  const voter = Address.fromString(SOME_ADDRESS);
  const propId = BIGINT_ONE;
  const support = 0; // against
  const votes = BigInt.fromI32(40);
  const voteEvent = createVoteCastEvent(voter, propId, support, votes);

  handleVoteCast(voteEvent);

  const savedProp = Proposal.load(propId.toString());

  assert.bigIntEquals(BigInt.fromI32(74), savedProp!.quorumVotes);

  clearStore();
});

test('handleVoteCast: uses quorum params from prop creation time, not newer params', () => {
  getOrCreateDelegate(SOME_ADDRESS);
  const totalSupply = BigInt.fromI32(200);

  // Set total supply
  const governance = getGovernanceEntity();
  governance.totalTokenHolders = totalSupply;
  governance.save();

  // Save dynamic quorum params
  const linearCoefficient = BigInt.fromI32(300000);
  const quadraticCoefficient = BigInt.fromI32(1000);
  handleAllQuorumParamEvents(1000, 4000, 500, linearCoefficient, quadraticCoefficient);

  // Create prop with state we need for quorum inputs
  const propEventInput = stubProposalCreatedWithRequirementsEventInput();
  propEventInput.quorumVotes = BIGINT_ZERO;
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);
  handleProposalCreatedWithRequirements(newPropEvent);

  // Update dynamic quorum params
  const greaterLinearCoefficient = BigInt.fromI32(600000);
  const greaterQuadraticCoefficient = BigInt.fromI32(20000);
  handleAllQuorumParamEvents(500, 6000, 0, greaterLinearCoefficient, greaterQuadraticCoefficient);

  const voter = Address.fromString(SOME_ADDRESS);
  const propId = BIGINT_ONE;
  const support = 0; // against
  const votes = BigInt.fromI32(50);
  const voteEvent = createVoteCastEvent(voter, propId, support, votes);

  handleVoteCast(voteEvent);

  const savedProp = Proposal.load(propId.toString());

  assert.bigIntEquals(BigInt.fromI32(80), savedProp!.quorumVotes);

  clearStore();
});

test('handleMinQuorumVotesBPSSet: saves incoming values', () => {
  const event1 = createMinQuorumVotesBPSSetEvent(0, 1);
  handleMinQuorumVotesBPSSet(event1);
  assert.i32Equals(1, getOrCreateDynamicQuorumParams().minQuorumVotesBPS);

  const event2 = createMinQuorumVotesBPSSetEvent(1, 2);
  handleMinQuorumVotesBPSSet(event2);
  assert.i32Equals(2, getOrCreateDynamicQuorumParams().minQuorumVotesBPS);

  clearStore();
});

test('handleMaxQuorumVotesBPSSet: saves incoming values', () => {
  const event1 = createMaxQuorumVotesBPSSetEvent(0, 1000);
  handleMaxQuorumVotesBPSSet(event1);
  assert.i32Equals(1000, getOrCreateDynamicQuorumParams().maxQuorumVotesBPS);

  const event2 = createMaxQuorumVotesBPSSetEvent(1000, 2000);
  handleMaxQuorumVotesBPSSet(event2);
  assert.i32Equals(2000, getOrCreateDynamicQuorumParams().maxQuorumVotesBPS);

  clearStore();
});

test('handleQuorumVotesBPSOffsetSet: saves incoming values', () => {
  const event1 = createQuorumVotesBPSOffsetSetEvent(0, 100);
  handleQuorumVotesBPSOffsetSet(event1);
  assert.i32Equals(100, getOrCreateDynamicQuorumParams().quorumVotesBPSOffset);

  const event2 = createQuorumVotesBPSOffsetSetEvent(100, 200);
  handleQuorumVotesBPSOffsetSet(event2);
  assert.i32Equals(200, getOrCreateDynamicQuorumParams().quorumVotesBPSOffset);

  clearStore();
});

test('handleQuorumLinearCoefficientSet: saves incoming values', () => {
  const event1 = createQuorumLinearCoefficientSetEvent(BIGINT_ZERO, BIGINT_ONE);
  handleQuorumLinearCoefficientSet(event1);
  assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams().quorumLinearCoefficient);

  const event2 = createQuorumLinearCoefficientSetEvent(BIGINT_ONE, BIGINT_10K);
  handleQuorumLinearCoefficientSet(event2);
  assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams().quorumLinearCoefficient);

  clearStore();
});

test('handleQuorumQuadraticCoefficientSet: saves incoming values', () => {
  const event1 = createQuorumQuadraticCoefficientSetEvent(BIGINT_ZERO, BIGINT_ONE);
  handleQuorumQuadraticCoefficientSet(event1);
  assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams().quorumQuadraticCoefficient);

  const event2 = createQuorumQuadraticCoefficientSetEvent(BIGINT_ONE, BIGINT_10K);
  handleQuorumQuadraticCoefficientSet(event2);
  assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams().quorumQuadraticCoefficient);

  clearStore();
});
