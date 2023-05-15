import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
} from './types/CryptopunksVote/CryptopunksVote';
import { OGPunk, OGPunkDelegationEvent } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';


let delegatedPunkId: string; // Use WebAssembly global due to lack of closure support
export function handleOGPunkDelegateChanged(event: DelegateChanged): void {
  let delegator = getOrCreateAccount(event.params.delegator.toHexString());
  let previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  let newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  delegatedPunkId = event.params.punkIndex.toString();
  let ogpunk = OGPunk.load(delegatedPunkId);

  ogpunk.delegate = newDelegate.id;
  ogpunk.save();

  let previousPunksRepresented = previousDelegate.punksRepresented; // Re-assignment required to update array
  previousDelegate.punksRepresented = previousPunksRepresented.filter(
    n => n != delegatedPunkId,
  );
  previousDelegate.save();

  let newPunksRepresented = newDelegate.punksRepresented; // Re-assignment required to update array
  newPunksRepresented.push(ogpunk.id);
  newDelegate.punksRepresented = newPunksRepresented;
  newDelegate.save();

  let delegateChangedEvent = new OGPunkDelegationEvent(
    event.transaction.hash.toHexString() + '_' + delegatedPunkId,
  );
  delegateChangedEvent.blockNumber = event.block.number;
  delegateChangedEvent.blockTimestamp = event.block.timestamp;
  delegateChangedEvent.ogpunk = ogpunk.id;
  delegateChangedEvent.delegator = delegator.id;
  delegateChangedEvent.previousDelegate = previousDelegate.id;
  delegateChangedEvent.newDelegate = newDelegate.id;
  delegateChangedEvent.save();
}

export function handleOGPunkDelegateVotesChanged(event: DelegateVotesChanged): void {
  let delegate = getOrCreateDelegate(event.params.delegate.toHexString());

  delegate.delegatedOGVotesRaw = event.params.newBalance;
  delegate.delegatedOGVotes = event.params.newBalance;
  delegate.save();
}
