import { assert, clearStore, test } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ByteArray } from '@graphprotocol/graph-ts';
import { Proposal } from '../src/types/schema';
import {
  handleProposalCreatedWithRequirements,
  handleVoteCast,
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumCoefficientSet,
} from '../src/nouns-dao';
import {
  createProposalCreatedWithRequirementsEvent,
  createVoteCastEvent,
  stubProposalCreatedWithRequirementsEventInput,
  createMinQuorumVotesBPSSetEvent,
  createMaxQuorumVotesBPSSetEvent,
  createQuorumCoefficientSetEvent,
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

  assert.bigIntEquals(BIGINT_ZERO, savedProp!.againstVotes);
  assert.bigIntEquals(totalSupply, savedProp!.totalSupply);

  clearStore();
});

test('handleVoteCast: given V1 prop does not update quorumVotes using dynamic quorum', () => {
  getOrCreateDelegate(SOME_ADDRESS);
  const totalSupply = BigInt.fromI32(200);

  // Set total supply
  const governance = getGovernanceEntity();
  governance.totalTokenHolders = totalSupply;
  governance.save();

  // Save dynamic quorum params
  handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_500_000));

  const dqParams = getOrCreateDynamicQuorumParams(null);
  assert.bigIntEquals(BIGINT_ZERO, dqParams.dynamicQuorumStartBlock as BigInt);

  // Create prop with state we need for quorum inputs
  // providing block number zero means this prop will look like a V1 prop
  // since the DQ events above are simulated to be at block zero
  const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);

  handleProposalCreatedWithRequirements(newPropEvent);
  const propId = BIGINT_ONE;

  let savedProp = Proposal.load(propId.toString());
  assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes);

  const voter = Address.fromString(SOME_ADDRESS);
  const support = 0; // against
  const votes = BigInt.fromI32(32);
  const voteEvent = createVoteCastEvent(voter, propId, support, votes);

  handleVoteCast(voteEvent);

  savedProp = Proposal.load(propId.toString());
  assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes);

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
  handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_500_000));

  const dqParams = getOrCreateDynamicQuorumParams(null);
  assert.bigIntEquals(BIGINT_ZERO, dqParams.dynamicQuorumStartBlock as BigInt);

  // Create prop with state we need for quorum inputs
  // providing a block number greater than zero means this prop will look like a V2 prop
  // since the DQ events above are simulated to be at block zero
  const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ONE);
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);

  handleProposalCreatedWithRequirements(newPropEvent);

  const voter = Address.fromString(SOME_ADDRESS);
  const propId = BIGINT_ONE;
  const support = 0; // against
  const votes = BigInt.fromI32(32);
  const voteEvent = createVoteCastEvent(voter, propId, support, votes);

  handleVoteCast(voteEvent);

  const savedProp = Proposal.load(propId.toString());

  assert.bigIntEquals(BigInt.fromI32(68), savedProp!.quorumVotes);

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
  handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_200_000));

  // Create prop with state we need for quorum inputs
  // providing a block number greater than zero means this prop will look like a V2 prop
  // since the DQ events above are simulated to be at block zero
  const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ONE);
  const newPropEvent = createProposalCreatedWithRequirementsEvent(propEventInput);
  handleProposalCreatedWithRequirements(newPropEvent);

  handleAllQuorumParamEvents(500, 6000, BigInt.fromI32(3_000_000));

  const voter = Address.fromString(SOME_ADDRESS);
  const propId = BIGINT_ONE;
  const support = 0; // against
  const votes = BigInt.fromI32(25);
  const voteEvent = createVoteCastEvent(voter, propId, support, votes);

  handleVoteCast(voteEvent);

  const savedProp = Proposal.load(propId.toString());

  assert.bigIntEquals(BigInt.fromI32(50), savedProp!.quorumVotes);

  clearStore();
});

test('handleMinQuorumVotesBPSSet: saves incoming values', () => {
  const event1 = createMinQuorumVotesBPSSetEvent(0, 1);
  handleMinQuorumVotesBPSSet(event1);
  assert.i32Equals(1, getOrCreateDynamicQuorumParams(BIGINT_ZERO).minQuorumVotesBPS);

  const event2 = createMinQuorumVotesBPSSetEvent(1, 2);
  handleMinQuorumVotesBPSSet(event2);
  assert.i32Equals(2, getOrCreateDynamicQuorumParams(BIGINT_ZERO).minQuorumVotesBPS);

  clearStore();
});

test('handleMaxQuorumVotesBPSSet: saves incoming values', () => {
  const event1 = createMaxQuorumVotesBPSSetEvent(0, 1000);
  handleMaxQuorumVotesBPSSet(event1);
  assert.i32Equals(1000, getOrCreateDynamicQuorumParams(BIGINT_ZERO).maxQuorumVotesBPS);

  const event2 = createMaxQuorumVotesBPSSetEvent(1000, 2000);
  handleMaxQuorumVotesBPSSet(event2);
  assert.i32Equals(2000, getOrCreateDynamicQuorumParams(BIGINT_ZERO).maxQuorumVotesBPS);

  clearStore();
});

test('handleQuorumCoefficientSet: saves incoming values', () => {
  const event1 = createQuorumCoefficientSetEvent(BIGINT_ZERO, BIGINT_ONE);
  handleQuorumCoefficientSet(event1);
  assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient);

  const event2 = createQuorumCoefficientSetEvent(BIGINT_ONE, BIGINT_10K);
  handleQuorumCoefficientSet(event2);
  assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient);

  clearStore();
});
