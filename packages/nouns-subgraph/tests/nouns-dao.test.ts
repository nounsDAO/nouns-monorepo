import { assert, clearStore, test } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ByteArray } from '@graphprotocol/graph-ts';
import { Proposal } from '../src/types/schema';
import {
  handleDynamicQuorumParamsSet,
  handleProposalCreatedWithRequirements,
  handleVoteCast,
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumVotesBPSOffsetSet,
  handleQuorumLinearCoefSet,
  handleQuorumQuadraticCoefSet,
} from '../src/nouns-dao';
import {
  createDynamicQuorumParamsSetEvent,
  createProposalCreatedWithRequirementsEvent,
  createVoteCastEvent,
  stubProposalCreatedWithRequirementsEventInput,
  createMinQuorumVotesBPSSetEvent,
  createMaxQuorumVotesBPSSetEvent,
  createQuorumVotesBPSOffsetSetEvent,
  createQuorumLinearCoefSetEvent,
  createQuorumQuadraticCoefSetEvent,
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

test('handleDynamicQuorumParamsSet: saves incoming values for the first time', () => {
  const linearCoef = BigInt.fromI32(1);
  const quadraticCoef = BigInt.fromI32(2);
  const newEvent = createDynamicQuorumParamsSetEvent(500, 2000, 700, linearCoef, quadraticCoef);

  handleDynamicQuorumParamsSet(newEvent);

  const savedParams = getOrCreateDynamicQuorumParams();

  assert.i32Equals(savedParams.minQuorumVotesBPS, 500);
  assert.i32Equals(savedParams.maxQuorumVotesBPS, 2000);
  assert.i32Equals(savedParams.quorumVotesBPSOffset, 700);

  assert.bigIntEquals(linearCoef, savedParams.quorumLinearCoef);
  assert.bigIntEquals(quadraticCoef, savedParams.quorumQuadraticCoef);

  clearStore();
});

test('handleDynamicQuorumParamsSet: saves incoming values on top of previous values', () => {
  let linearCoef = BigInt.fromI32(1);
  let quadraticCoef = BigInt.fromI32(2);
  const firstEvent = createDynamicQuorumParamsSetEvent(500, 2000, 700, linearCoef, quadraticCoef);
  handleDynamicQuorumParamsSet(firstEvent);

  linearCoef = BigInt.fromI32(3);
  quadraticCoef = BigInt.fromI32(4);
  const secondEvent = createDynamicQuorumParamsSetEvent(555, 2222, 777, linearCoef, quadraticCoef);
  handleDynamicQuorumParamsSet(secondEvent);

  const savedParams = getOrCreateDynamicQuorumParams();

  assert.i32Equals(savedParams.minQuorumVotesBPS, 555);
  assert.i32Equals(savedParams.maxQuorumVotesBPS, 2222);
  assert.i32Equals(savedParams.quorumVotesBPSOffset, 777);

  assert.bigIntEquals(linearCoef, savedParams.quorumLinearCoef);
  assert.bigIntEquals(quadraticCoef, savedParams.quorumQuadraticCoef);

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
  const linearCoef = BigInt.fromI32(300000);
  const quadraticCoef = BigInt.fromI32(1000);
  const quorumParamsEvent = createDynamicQuorumParamsSetEvent(
    1000,
    4000,
    500,
    linearCoef,
    quadraticCoef,
  );
  handleDynamicQuorumParamsSet(quorumParamsEvent);

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
  const linearCoef = BigInt.fromI32(300000);
  const quadraticCoef = BigInt.fromI32(1000);
  const quorumParamsEvent = createDynamicQuorumParamsSetEvent(
    1000,
    4000,
    500,
    linearCoef,
    quadraticCoef,
  );
  handleDynamicQuorumParamsSet(quorumParamsEvent);

  // Create prop with state we need for quorum inputs
  const propEventInput = stubProposalCreatedWithRequirementsEventInput();
  propEventInput.quorumVotes = BIGINT_ZERO;
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);
  handleProposalCreatedWithRequirements(newPropEvent);

  // Update dynamic quorum params
  const greaterLinearCoef = BigInt.fromI32(600000);
  const greaterQuadraticCoef = BigInt.fromI32(20000);
  const higherQuorumParamsEvent = createDynamicQuorumParamsSetEvent(
    500,
    6000,
    0,
    greaterLinearCoef,
    greaterQuadraticCoef,
  );
  handleDynamicQuorumParamsSet(higherQuorumParamsEvent);

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

test('handleQuorumLinearCoefSet: saves incoming values', () => {
  const event1 = createQuorumLinearCoefSetEvent(BIGINT_ZERO, BIGINT_ONE);
  handleQuorumLinearCoefSet(event1);
  assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams().quorumLinearCoef);

  const event2 = createQuorumLinearCoefSetEvent(BIGINT_ONE, BIGINT_10K);
  handleQuorumLinearCoefSet(event2);
  assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams().quorumLinearCoef);

  clearStore();
});

test('handleQuorumQuadraticCoefSet: saves incoming values', () => {
  const event1 = createQuorumQuadraticCoefSetEvent(BIGINT_ZERO, BIGINT_ONE);
  handleQuorumQuadraticCoefSet(event1);
  assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams().quorumQuadraticCoef);

  const event2 = createQuorumQuadraticCoefSetEvent(BIGINT_ONE, BIGINT_10K);
  handleQuorumQuadraticCoefSet(event2);
  assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams().quorumQuadraticCoef);

  clearStore();
});
