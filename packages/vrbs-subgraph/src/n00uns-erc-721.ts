import { log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  VrbCreated,
  Transfer,
} from './types/VrbsToken/VrbsToken';
import { Vrb, Seed, DelegationEvent, TransferEvent } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handleVrbCreated(event: VrbCreated): void {
  let vrbId = event.params.tokenId.toString();

  let seed = new Seed(vrbId);
  seed.background = event.params.seed.background;
  seed.body = event.params.seed.body;
  seed.accessory = event.params.seed.accessory;
  seed.head = event.params.seed.head;
  seed.glasses = event.params.seed.glasses;
  seed.save();

  let vrb = Vrb.load(vrbId);
  if (vrb == null) {
    log.error('[handleVrbCreated] Vrb #{} not found. Hash: {}', [
      vrbId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  vrb.seed = seed.id;
  vrb.save();
}

// Use WebAssembly global due to lack of closure support
let accountVrbs: string[] = [];

export function handleDelegateChanged(event: DelegateChanged): void {
  let tokenHolder = getOrCreateAccount(event.params.delegator.toHexString());
  let previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  let newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  accountVrbs = tokenHolder.vrbs;

  tokenHolder.delegate = newDelegate.id;
  tokenHolder.save();

  previousDelegate.tokenHoldersRepresentedAmount =
    previousDelegate.tokenHoldersRepresentedAmount - 1;
  let previousVrbsRepresented = previousDelegate.vrbsRepresented; // Re-assignment required to update array
  previousDelegate.vrbsRepresented = previousVrbsRepresented.filter(
    n => !accountVrbs.includes(n),
  );
  newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
  let newVrbsRepresented = newDelegate.vrbsRepresented; // Re-assignment required to update array
  for (let i = 0; i < accountVrbs.length; i++) {
    newVrbsRepresented.push(accountVrbs[i]);
  }
  newDelegate.vrbsRepresented = newVrbsRepresented;
  previousDelegate.save();
  newDelegate.save();

  // Log a transfer event for each Vrb
  for (let i = 0; i < accountVrbs.length; i++) {
    let delegateChangedEvent = new DelegationEvent(
      event.transaction.hash.toHexString() + '_' + accountVrbs[i],
    );
    delegateChangedEvent.blockNumber = event.block.number;
    delegateChangedEvent.blockTimestamp = event.block.timestamp;
    delegateChangedEvent.vrb = accountVrbs[i];
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
  let votesDifference = event.params.newBalance.minus(event.params.previousBalance);

  delegate.delegatedVotesRaw = event.params.newBalance;
  delegate.delegatedVotes = event.params.newBalance;
  delegate.save();

  if (event.params.previousBalance == BIGINT_ZERO && event.params.newBalance > BIGINT_ZERO) {
    governance.currentDelegates = governance.currentDelegates.plus(BIGINT_ONE);
  }
  if (event.params.newBalance == BIGINT_ZERO) {
    governance.currentDelegates = governance.currentDelegates.minus(BIGINT_ONE);
  }
  governance.delegatedVotesRaw = governance.delegatedVotesRaw.plus(votesDifference);
  governance.delegatedVotes = governance.delegatedVotesRaw;
  governance.save();
}

let transferredVrbId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  let fromHolder = getOrCreateAccount(event.params.from.toHexString());
  let toHolder = getOrCreateAccount(event.params.to.toHexString());
  let governance = getGovernanceEntity();
  transferredVrbId = event.params.tokenId.toString();

  let transferEvent = new TransferEvent(
    event.transaction.hash.toHexString() + '_' + transferredVrbId,
  );
  transferEvent.blockNumber = event.block.number;
  transferEvent.blockTimestamp = event.block.timestamp;
  transferEvent.vrb = event.params.tokenId.toString();
  transferEvent.previousHolder = fromHolder.id.toString();
  transferEvent.newHolder = toHolder.id.toString();
  transferEvent.save();

  // fromHolder
  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders.plus(BIGINT_ONE);
    governance.save();
  } else {
    let fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw = fromHolder.tokenBalanceRaw.minus(BIGINT_ONE);
    fromHolder.tokenBalance = fromHolder.tokenBalanceRaw;
    let fromHolderVrbs = fromHolder.vrbs; // Re-assignment required to update array
    fromHolder.vrbs = fromHolderVrbs.filter(n => n != transferredVrbId);

    if (fromHolder.delegate != null) {
      let fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate as string);
      let fromHolderVrbsRepresented = fromHolderDelegate.vrbsRepresented; // Re-assignment required to update array
      fromHolderDelegate.vrbsRepresented = fromHolderVrbsRepresented.filter(
        n => n != transferredVrbId,
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
      governance.currentTokenHolders = governance.currentTokenHolders.minus(BIGINT_ONE);
      governance.save();

      fromHolder.delegate = null;
    } else if (
      fromHolder.tokenBalanceRaw > BIGINT_ZERO &&
      fromHolderPreviousBalance == BIGINT_ZERO
    ) {
      governance.currentTokenHolders = governance.currentTokenHolders.plus(BIGINT_ONE);
      governance.save();
    }

    fromHolder.save();
  }

  // toHolder
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders.minus(BIGINT_ONE);
    governance.save();
  }

  let delegateChangedEvent = new DelegationEvent(
    event.transaction.hash.toHexString() + '_' + event.params.tokenId.toString(),
  );
  delegateChangedEvent.blockNumber = event.block.number;
  delegateChangedEvent.blockTimestamp = event.block.timestamp;
  delegateChangedEvent.vrb = event.params.tokenId.toString();
  delegateChangedEvent.previousDelegate = fromHolder.delegate
    ? fromHolder.delegate!.toString()
    : fromHolder.id.toString();
  delegateChangedEvent.newDelegate = toHolder.delegate
    ? toHolder.delegate!.toString()
    : toHolder.id.toString();
  delegateChangedEvent.save();

  let toHolderDelegate = getOrCreateDelegate(toHolder.delegate ? toHolder.delegate! : toHolder.id);
  let toHolderVrbsRepresented = toHolderDelegate.vrbsRepresented; // Re-assignment required to update array
  toHolderVrbsRepresented.push(transferredVrbId);
  toHolderDelegate.vrbsRepresented = toHolderVrbsRepresented;
  toHolderDelegate.save();

  let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw.plus(BIGINT_ONE);
  toHolder.tokenBalance = toHolder.tokenBalanceRaw;
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw.plus(BIGINT_ONE);
  toHolder.totalTokensHeld = toHolder.totalTokensHeldRaw;
  let toHolderVrbs = toHolder.vrbs; // Re-assignment required to update array
  toHolderVrbs.push(event.params.tokenId.toString());
  toHolder.vrbs = toHolderVrbs;

  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.minus(BIGINT_ONE);
    governance.save();
  } else if (toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.plus(BIGINT_ONE);
    governance.save();

    toHolder.delegate = toHolder.id;
  }

  let vrb = Vrb.load(transferredVrbId);
  if (vrb == null) {
    vrb = new Vrb(transferredVrbId);
  }

  vrb.owner = toHolder.id;
  vrb.save();

  toHolder.save();
}
