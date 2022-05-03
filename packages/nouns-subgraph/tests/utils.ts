import { newMockEvent } from 'matchstick-as/assembly/index';
import { ProposalCreatedWithRequirements } from '../src/types/NounsDAO/NounsDAO';
import { Address, ethereum, Bytes, BigInt } from '@graphprotocol/graph-ts';

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
