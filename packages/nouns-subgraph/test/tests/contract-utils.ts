import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  DelegateChanged,
  DelegateVotesChanged,
  DescriptorLocked,
  DescriptorUpdated,
  MinterLocked,
  MinterUpdated,
  NounBurned,
  NounCreated,
  NoundersDAOUpdated,
  OwnershipTransferred,
  SeederLocked,
  SeederUpdated,
  Transfer
} from "../generated/Contract/Contract"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createDelegateChangedEvent(
  delegator: Address,
  fromDelegate: Address,
  toDelegate: Address
): DelegateChanged {
  let delegateChangedEvent = changetype<DelegateChanged>(newMockEvent())

  delegateChangedEvent.parameters = new Array()

  delegateChangedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "fromDelegate",
      ethereum.Value.fromAddress(fromDelegate)
    )
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "toDelegate",
      ethereum.Value.fromAddress(toDelegate)
    )
  )

  return delegateChangedEvent
}

export function createDelegateVotesChangedEvent(
  delegate: Address,
  previousBalance: BigInt,
  newBalance: BigInt
): DelegateVotesChanged {
  let delegateVotesChangedEvent = changetype<DelegateVotesChanged>(
    newMockEvent()
  )

  delegateVotesChangedEvent.parameters = new Array()

  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam("delegate", ethereum.Value.fromAddress(delegate))
  )
  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousBalance",
      ethereum.Value.fromUnsignedBigInt(previousBalance)
    )
  )
  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newBalance",
      ethereum.Value.fromUnsignedBigInt(newBalance)
    )
  )

  return delegateVotesChangedEvent
}

export function createDescriptorLockedEvent(): DescriptorLocked {
  let descriptorLockedEvent = changetype<DescriptorLocked>(newMockEvent())

  descriptorLockedEvent.parameters = new Array()

  return descriptorLockedEvent
}

export function createDescriptorUpdatedEvent(
  descriptor: Address
): DescriptorUpdated {
  let descriptorUpdatedEvent = changetype<DescriptorUpdated>(newMockEvent())

  descriptorUpdatedEvent.parameters = new Array()

  descriptorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "descriptor",
      ethereum.Value.fromAddress(descriptor)
    )
  )

  return descriptorUpdatedEvent
}

export function createMinterLockedEvent(): MinterLocked {
  let minterLockedEvent = changetype<MinterLocked>(newMockEvent())

  minterLockedEvent.parameters = new Array()

  return minterLockedEvent
}

export function createMinterUpdatedEvent(minter: Address): MinterUpdated {
  let minterUpdatedEvent = changetype<MinterUpdated>(newMockEvent())

  minterUpdatedEvent.parameters = new Array()

  minterUpdatedEvent.parameters.push(
    new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter))
  )

  return minterUpdatedEvent
}

export function createNounBurnedEvent(tokenId: BigInt): NounBurned {
  let nounBurnedEvent = changetype<NounBurned>(newMockEvent())

  nounBurnedEvent.parameters = new Array()

  nounBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return nounBurnedEvent
}

export function createNounCreatedEvent(
  tokenId: BigInt,
  seed: ethereum.Tuple
): NounCreated {
  let nounCreatedEvent = changetype<NounCreated>(newMockEvent())

  nounCreatedEvent.parameters = new Array()

  nounCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nounCreatedEvent.parameters.push(
    new ethereum.EventParam("seed", ethereum.Value.fromTuple(seed))
  )

  return nounCreatedEvent
}

export function createNoundersDAOUpdatedEvent(
  noundersDAO: Address
): NoundersDAOUpdated {
  let noundersDaoUpdatedEvent = changetype<NoundersDAOUpdated>(newMockEvent())

  noundersDaoUpdatedEvent.parameters = new Array()

  noundersDaoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "noundersDAO",
      ethereum.Value.fromAddress(noundersDAO)
    )
  )

  return noundersDaoUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSeederLockedEvent(): SeederLocked {
  let seederLockedEvent = changetype<SeederLocked>(newMockEvent())

  seederLockedEvent.parameters = new Array()

  return seederLockedEvent
}

export function createSeederUpdatedEvent(seeder: Address): SeederUpdated {
  let seederUpdatedEvent = changetype<SeederUpdated>(newMockEvent())

  seederUpdatedEvent.parameters = new Array()

  seederUpdatedEvent.parameters.push(
    new ethereum.EventParam("seeder", ethereum.Value.fromAddress(seeder))
  )

  return seederUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
