import { newMockEvent } from 'matchstick-as/assembly/index';
import {
  ProposalCreatedWithRequirements,
  VoteCast,
  MinQuorumVotesBPSSet,
  MaxQuorumVotesBPSSet,
  QuorumCoefficientSet,
} from '../src/types/NounsDAO/NounsDAO';
import {
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumCoefficientSet,
} from '../src/nouns-dao';
import { Address, ethereum, Bytes, BigInt, ByteArray } from '@graphprotocol/graph-ts';
import { BIGINT_ONE, BIGINT_ZERO } from '../src/utils/constants';

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

export function stubProposalCreatedWithRequirementsEventInput(
  eventBlockNumber: BigInt = BIGINT_ZERO,
): ProposalCreatedWithRequirementsEvent {
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
    eventBlockNumber: eventBlockNumber,
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

export function createMinQuorumVotesBPSSetEvent(
  oldMinQuorumVotesBPS: i32,
  newMinQuorumVotesBPS: i32,
): MinQuorumVotesBPSSet {
  let newEvent = changetype<MinQuorumVotesBPSSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = new Array();

  newEvent.parameters.push(
    new ethereum.EventParam('oldMinQuorumVotesBPS', ethereum.Value.fromI32(oldMinQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('newMinQuorumVotesBPS', ethereum.Value.fromI32(newMinQuorumVotesBPS)),
  );

  return newEvent;
}

export function createMaxQuorumVotesBPSSetEvent(
  oldMaxQuorumVotesBPS: i32,
  newMaxQuorumVotesBPS: i32,
): MaxQuorumVotesBPSSet {
  let newEvent = changetype<MaxQuorumVotesBPSSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = new Array();

  newEvent.parameters.push(
    new ethereum.EventParam('oldMaxQuorumVotesBPS', ethereum.Value.fromI32(oldMaxQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('newMaxQuorumVotesBPS', ethereum.Value.fromI32(newMaxQuorumVotesBPS)),
  );

  return newEvent;
}

export function createQuorumCoefficientSetEvent(
  oldQuorumCoefficient: BigInt,
  newQuorumCoefficient: BigInt,
): QuorumCoefficientSet {
  let newEvent = changetype<QuorumCoefficientSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = new Array();

  newEvent.parameters.push(
    new ethereum.EventParam(
      'oldQuorumCoefficient',
      ethereum.Value.fromUnsignedBigInt(oldQuorumCoefficient),
    ),
  );

  newEvent.parameters.push(
    new ethereum.EventParam(
      'newQuorumCoefficient',
      ethereum.Value.fromUnsignedBigInt(newQuorumCoefficient),
    ),
  );

  return newEvent;
}

export function handleAllQuorumParamEvents(
  newMinQuorumVotesBPS: i32,
  newMaxQuorumVotesBPS: i32,
  newCoefficient: BigInt,
): void {
  handleMinQuorumVotesBPSSet(createMinQuorumVotesBPSSetEvent(0, newMinQuorumVotesBPS));
  handleMaxQuorumVotesBPSSet(createMaxQuorumVotesBPSSetEvent(0, newMaxQuorumVotesBPS));
  handleQuorumCoefficientSet(createQuorumCoefficientSetEvent(BIGINT_ZERO, newCoefficient));
}
