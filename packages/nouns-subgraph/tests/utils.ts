import { newMockEvent } from 'matchstick-as/assembly/index';
import {
  DynamicQuorumParamsSet,
  ProposalCreatedWithRequirements,
  VoteCast,
} from '../src/types/NounsDAO/NounsDAO';
import { Address, ethereum, Bytes, BigInt, ByteArray } from '@graphprotocol/graph-ts';
import { BIGINT_ONE } from '../src/utils/constants';

export class ProposalCreatedWithRequirementsEvent {
  id: BigInt;
  proposer: Address;
  targets: Address[];
  values: BigInt[];
  signatures: string[];
  calldatas: Bytes[];
  startBlock: BigInt;
  endBlock: BigInt;
  proposalThreshold: BigInt;
  quorumVotes: BigInt;
  description: string;
  eventBlockNumber: BigInt;
}

export function createProposalCreatedWithRequirementsEvent(
  input: ProposalCreatedWithRequirementsEvent,
): ProposalCreatedWithRequirements {
  let newEvent = changetype<ProposalCreatedWithRequirements>(newMockEvent());
  newEvent.parameters = new Array();

  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(input.id)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(input.proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(input.targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(input.values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(input.signatures)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(input.calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('startBlock', ethereum.Value.fromUnsignedBigInt(input.startBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('endBlock', ethereum.Value.fromUnsignedBigInt(input.endBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam(
      'proposalThreshold',
      ethereum.Value.fromUnsignedBigInt(input.proposalThreshold),
    ),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('quorumVotes', ethereum.Value.fromUnsignedBigInt(input.quorumVotes)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(input.description)),
  );

  newEvent.block.number = input.eventBlockNumber;

  return newEvent;
}

export function createDynamicQuorumParamsSetEvent(
  minQuorumVotesBPS: i32,
  maxQuorumVotesBPS: i32,
  quorumVotesBPSOffset: i32,
  quorumLinearCoef: BigInt,
  quorumQuadraticCoef: BigInt,
): DynamicQuorumParamsSet {
  let newEvent = changetype<DynamicQuorumParamsSet>(newMockEvent());
  newEvent.parameters = new Array();

  newEvent.parameters.push(
    new ethereum.EventParam('minQuorumVotesBPS', ethereum.Value.fromI32(minQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('maxQuorumVotesBPS', ethereum.Value.fromI32(maxQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('quorumVotesBPSOffset', ethereum.Value.fromI32(quorumVotesBPSOffset)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam(
      'quorumLinearCoef',
      ethereum.Value.fromUnsignedBigInt(quorumLinearCoef),
    ),
  );

  newEvent.parameters.push(
    new ethereum.EventParam(
      'quorumQuadraticCoef',
      ethereum.Value.fromUnsignedBigInt(quorumQuadraticCoef),
    ),
  );

  return newEvent;
}

export function stubProposalCreatedWithRequirementsEventInput(): ProposalCreatedWithRequirementsEvent {
  return {
    id: BigInt.fromI32(1),
    proposer: Address.fromString('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
    targets: [Address.fromString('0x000000000000000000000000000000000000dEaD')],
    values: [BigInt.fromI32(0)],
    signatures: ['some signature'],
    calldatas: [changetype<Bytes>(ByteArray.fromBigInt(BIGINT_ONE))],
    startBlock: BigInt.fromI32(3),
    endBlock: BigInt.fromI32(103),
    proposalThreshold: BIGINT_ONE,
    quorumVotes: BIGINT_ONE,
    description: 'some description',
    eventBlockNumber: BigInt.fromI32(4),
  };
}

export function createVoteCastEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  votes: BigInt,
): VoteCast {
  let newEvent = changetype<VoteCast>(newMockEvent());
  newEvent.parameters = new Array();

  newEvent.parameters.push(new ethereum.EventParam('voter', ethereum.Value.fromAddress(voter)));
  newEvent.parameters.push(
    new ethereum.EventParam('proposalId', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(new ethereum.EventParam('support', ethereum.Value.fromI32(support)));
  newEvent.parameters.push(
    new ethereum.EventParam('votes', ethereum.Value.fromUnsignedBigInt(votes)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('reason', ethereum.Value.fromString('some reason')),
  );

  return newEvent;
}
