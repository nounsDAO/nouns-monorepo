import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  PunkCreated,
  Transfer,
} from './types/NToken/NToken';
import { Punk, Seed, DelegationEvent, TransferEvent } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handlePunkCreated(event: PunkCreated): void {
  let tokenId = event.params.tokenId.toString();

  let seed = new Seed(tokenId);
  seed.punkType = BigInt.fromI32(event.params.seed.punkType);
  seed.skinTone = BigInt.fromI32(event.params.seed.skinTone);
  let accessories = event.params.seed.accessories
  let accessory_types = new Array<BigInt>();
  let accessory_ids = new Array<BigInt>();
  for(let i = 0; i < accessories.length; i ++) {
    accessory_types.push(BigInt.fromI32(accessories[i].accType))
    accessory_ids.push(BigInt.fromI32(accessories[i].accId))
  }
  seed.accessory_types = accessory_types;
  seed.accessory_ids = accessory_ids;
  seed.save();

  let punk = Punk.load(tokenId);
  if (punk == null) {
    log.error('[handlePunkCreated] Punk #{} not found. Hash: {}', [
      tokenId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  punk.seed = seed.id;
  punk.save();
}

// Use WebAssembly global due to lack of closure support
let accountPunks: string[] = [];

export function handleDelegateChanged(event: DelegateChanged): void {
  let tokenHolder = getOrCreateAccount(event.params.delegator.toHexString());
  let previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  let newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  accountPunks = tokenHolder.punks;

  tokenHolder.delegate = newDelegate.id;
  tokenHolder.save();

  previousDelegate.tokenHoldersRepresentedAmount =
    previousDelegate.tokenHoldersRepresentedAmount - 1;
  let previousPunksRepresented = previousDelegate.punksRepresented; // Re-assignment required to update array
  previousDelegate.punksRepresented = previousPunksRepresented.filter(
    n => !accountPunks.includes(n),
  );
  newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
  let newPunksRepresented = newDelegate.punksRepresented; // Re-assignment required to update array
  for (let i = 0; i < accountPunks.length; i++) {
    newPunksRepresented.push(accountPunks[i]);
  }
  newDelegate.punksRepresented = newPunksRepresented;
  previousDelegate.save();
  newDelegate.save();

  // Log a transfer event for each Punk
  for (let i = 0; i < accountPunks.length; i++) {
    let delegateChangedEvent = new DelegationEvent(
      event.transaction.hash.toHexString() + '_' + accountPunks[i],
    );
    delegateChangedEvent.blockNumber = event.block.number;
    delegateChangedEvent.blockTimestamp = event.block.timestamp;
    delegateChangedEvent.punk = accountPunks[i];
    delegateChangedEvent.previousDelegate = previousDelegate.id
      ? previousDelegate.id
      : tokenHolder.id;
    delegateChangedEvent.newDelegate = newDelegate.id ? newDelegate.id : tokenHolder.id;
    delegateChangedEvent.save();
  }
}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {
  let governance = getGovernanceEntity();
  let delegate = getOrCreateDelegate(event.params.delegate.toHexString());
  let votesDifference = event.params.newBalance - event.params.previousBalance;

  delegate.delegatedVotesRaw = event.params.newBalance;
  delegate.delegatedVotes = event.params.newBalance;
  delegate.save();

  if (event.params.previousBalance == BIGINT_ZERO && event.params.newBalance > BIGINT_ZERO) {
    governance.currentDelegates = governance.currentDelegates + BIGINT_ONE;
  }
  if (event.params.newBalance == BIGINT_ZERO) {
    governance.currentDelegates = governance.currentDelegates - BIGINT_ONE;
  }
  governance.delegatedVotesRaw = governance.delegatedVotesRaw + votesDifference;
  governance.delegatedVotes = governance.delegatedVotesRaw;
  governance.save();
}

let transferredPunkId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  let fromHolder = getOrCreateAccount(event.params.from.toHexString());
  let toHolder = getOrCreateAccount(event.params.to.toHexString());
  let governance = getGovernanceEntity();
  transferredPunkId = event.params.tokenId.toString();


  let transferEvent = new TransferEvent(event.transaction.hash.toHexString() + "_" + transferredPunkId);
  transferEvent.blockNumber = event.block.number;
  transferEvent.blockTimestamp = event.block.timestamp;
  transferEvent.punk = event.params.tokenId.toString();
  transferEvent.previousHolder = fromHolder.id.toString();
  transferEvent.newHolder = toHolder.id.toString();
  transferEvent.save();

  // fromHolder
  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders + BIGINT_ONE;
    governance.save();
  } else {
    let fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw = fromHolder.tokenBalanceRaw - BIGINT_ONE;
    fromHolder.tokenBalance = fromHolder.tokenBalanceRaw;
    let fromHolderPunks = fromHolder.punks; // Re-assignment required to update array
    fromHolder.punks = fromHolderPunks.filter(n => n != transferredPunkId);

    if (fromHolder.delegate != null) {
      let fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate);
      let fromHolderPunksRepresented = fromHolderDelegate.punksRepresented; // Re-assignment required to update array
      fromHolderDelegate.punksRepresented = fromHolderPunksRepresented.filter(
        n => n != transferredPunkId,
      );
      fromHolderDelegate.save();
    }

    if (fromHolder.tokenBalanceRaw < BIGINT_ZERO) {
      log.error('Negative balance on holder {} with balance {}', [
        fromHolder.id,
        fromHolder.tokenBalanceRaw.toString(),
      ]);
    }

    if (fromHolder.tokenBalanceRaw == BIGINT_ZERO && fromHolderPreviousBalance > BIGINT_ZERO) {
      governance.currentTokenHolders = governance.currentTokenHolders - BIGINT_ONE;
      governance.save();

      fromHolder.delegate = null;
    } else if (
      fromHolder.tokenBalanceRaw > BIGINT_ZERO &&
      fromHolderPreviousBalance == BIGINT_ZERO
    ) {
      governance.currentTokenHolders = governance.currentTokenHolders + BIGINT_ONE;
      governance.save();
    }

    fromHolder.save();
  }

  // toHolder
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders - BIGINT_ONE;
    governance.save();
  }

  let delegateChangedEvent = new DelegationEvent(
    event.transaction.hash.toHexString() + '_' + event.params.tokenId.toString(),
  );
  delegateChangedEvent.blockNumber = event.block.number;
  delegateChangedEvent.blockTimestamp = event.block.timestamp;
  delegateChangedEvent.punk = event.params.tokenId.toString();
  delegateChangedEvent.previousDelegate = fromHolder.delegate
    ? fromHolder.delegate.toString()
    : fromHolder.id.toString();
  delegateChangedEvent.newDelegate = toHolder.delegate
    ? toHolder.delegate.toString()
    : toHolder.id.toString();
  delegateChangedEvent.save();

  let toHolderDelegate = getOrCreateDelegate(toHolder.delegate ? toHolder.delegate: toHolder.id);
  let toHolderPunksRepresented = toHolderDelegate.punksRepresented; // Re-assignment required to update array
  toHolderPunksRepresented.push(transferredPunkId);
  toHolderDelegate.punksRepresented = toHolderPunksRepresented;
  toHolderDelegate.save();

  let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw + BIGINT_ONE;
  toHolder.tokenBalance = toHolder.tokenBalanceRaw;
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw + BIGINT_ONE;
  toHolder.totalTokensHeld = toHolder.totalTokensHeldRaw;
  let toHolderPunks = toHolder.punks; // Re-assignment required to update array
  toHolderPunks.push(event.params.tokenId.toString());
  toHolder.punks = toHolderPunks;

  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders - BIGINT_ONE;
    governance.save();
  } else if (toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders + BIGINT_ONE;
    governance.save();

    toHolder.delegate = toHolder.id;
  }

  let punk = Punk.load(transferredPunkId);
  if (punk == null) {
    punk = new Punk(transferredPunkId);
  }

  punk.owner = toHolder.id;
  punk.save();

  toHolder.save();
}
