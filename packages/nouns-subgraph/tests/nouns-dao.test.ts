import { assert, clearStore, test } from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ByteArray } from '@graphprotocol/graph-ts';
import { Proposal } from '../src/types/schema';
import {
  handleDynamicQuorumParamsSet,
  handleProposalCreatedWithRequirements,
} from '../src/nouns-dao';
import {
  createDynamicQuorumParamsSetEvent,
  createProposalCreatedWithRequirementsEvent,
} from './utils';
import { BIGINT_ONE, STATUS_ACTIVE, STATUS_PENDING } from '../src/utils/constants';
import { getDynamicQuorumParams } from '../src/utils/helpers';

test('handleProposalCreatedWithRequirements: saved PENDING proposal as expected', () => {
  const startBlock = BigInt.fromI32(3);
  const endBlock = BigInt.fromI32(103);
  const eventBlockNumber = BigInt.fromI32(2);

  const newEvent = createProposalCreatedWithRequirementsEvent({
    id: BigInt.fromI32(1),
    proposer: Address.fromString('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
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

  assert.stringEquals(
    savedProp!.proposer,
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase(),
  );
  assert.stringEquals(savedProp!.status, STATUS_PENDING);

  clearStore();
});

test('handleProposalCreatedWithRequirements: saved ACTIVE proposal as expected', () => {
  const startBlock = BigInt.fromI32(3);
  const endBlock = BigInt.fromI32(103);
  const eventBlockNumber = BigInt.fromI32(4);

  const newEvent = createProposalCreatedWithRequirementsEvent({
    id: BigInt.fromI32(1),
    proposer: Address.fromString('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
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

  assert.stringEquals(
    savedProp!.proposer,
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase(),
  );
  assert.stringEquals(savedProp!.status, STATUS_ACTIVE);

  clearStore();
});

test('handleDynamicQuorumParamsSet: saves incoming values for the first time', () => {
  const coefs = [BigInt.fromI32(1), BigInt.fromI32(2)];
  const newEvent = createDynamicQuorumParamsSetEvent(500, 2000, 700, coefs);

  handleDynamicQuorumParamsSet(newEvent);

  const savedParams = getDynamicQuorumParams();

  assert.i32Equals(savedParams.minQuorumVotesBPS, 500);
  assert.i32Equals(savedParams.maxQuorumVotesBPS, 2000);
  assert.i32Equals(savedParams.quorumVotesBPSOffset, 700);

  // have to do this cast due to compliation issues when trying to use the value directly
  const savedCoefs = savedParams.quorumPolynomCoefs as Array<BigInt>;
  assert.bigIntEquals(savedCoefs[0], coefs[0]);
  assert.bigIntEquals(savedCoefs[1], coefs[1]);

  clearStore();
});

test('handleDynamicQuorumParamsSet: saves incoming values on top of previous values', () => {
  let coefs = [BigInt.fromI32(1), BigInt.fromI32(2)];
  const firstEvent = createDynamicQuorumParamsSetEvent(500, 2000, 700, coefs);
  handleDynamicQuorumParamsSet(firstEvent);

  coefs = [BigInt.fromI32(3), BigInt.fromI32(4)];
  const secondEvent = createDynamicQuorumParamsSetEvent(555, 2222, 777, coefs);
  handleDynamicQuorumParamsSet(secondEvent);

  const savedParams = getDynamicQuorumParams();

  assert.i32Equals(savedParams.minQuorumVotesBPS, 555);
  assert.i32Equals(savedParams.maxQuorumVotesBPS, 2222);
  assert.i32Equals(savedParams.quorumVotesBPSOffset, 777);

  const savedCoefs = savedParams.quorumPolynomCoefs as Array<BigInt>;
  assert.bigIntEquals(savedCoefs[0], coefs[0]);
  assert.bigIntEquals(savedCoefs[1], coefs[1]);

  clearStore();
});
