import { log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  NounBRCreated,
  Transfer,
} from './types/NounsBRToken/NounsBRToken';
import { NounBR, Seed, DelegationEvent, TransferEvent } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handleNounBRCreated(event: NounBRCreated): void {
  let nounbrId = event.params.tokenId.toString();

  let seed = new Seed(nounbrId);
  seed.background = event.params.seed.background;
  seed.body = event.params.seed.body;
  seed.accessory = event.params.seed.accessory;
  seed.head = event.params.seed.head;
  seed.glasses = event.params.seed.glasses;
  seed.save();

  let nounbr = NounBR.load(nounbrId);
  if (nounbr == null) {
    log.error('[handleNounBRCreated] NounBR #{} not found. Hash: {}', [
      nounbrId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  nounbr.seed = seed.id;
  nounbr.save();
}

// Use WebAssembly global due to lack of closure support
let accountNounsBR: string[] = [];

export function handleDelegateChanged(event: DelegateChanged): void {
  let tokenHolder = getOrCreateAccount(event.params.delegator.toHexString());
  let previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  let newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  accountNounsBR = tokenHolder.nounsbr;

  tokenHolder.delegate = newDelegate.id;
  tokenHolder.save();

  previousDelegate.tokenHoldersRepresentedAmount =
    previousDelegate.tokenHoldersRepresentedAmount - 1;
  let previousNounsBRRepresented = previousDelegate.nounsbrRepresented; // Re-assignment required to update array
  previousDelegate.nounsbrRepresented = previousNounsBRRepresented.filter(
    n => !accountNounsBR.includes(n),
  );
  newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
  let newNounsBRRepresented = newDelegate.nounsbrRepresented; // Re-assignment required to update array
  for (let i = 0; i < accountNounsBR.length; i++) {
    newNounsBRRepresented.push(accountNounsBR[i]);
  }
  newDelegate.nounsbrRepresented = newNounsBRRepresented;
  previousDelegate.save();
  newDelegate.save();

  // Log a transfer event for each NounBR
  for (let i = 0; i < accountNounsBR.length; i++) {
    let delegateChangedEvent = new DelegationEvent(
      event.transaction.hash.toHexString() + '_' + accountNounsBR[i],
    );
    delegateChangedEvent.blockNumber = event.block.number;
    delegateChangedEvent.blockTimestamp = event.block.timestamp;
    delegateChangedEvent.nounbr = accountNounsBR[i];
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

let transferredNounBRId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  let fromHolder = getOrCreateAccount(event.params.from.toHexString());
  let toHolder = getOrCreateAccount(event.params.to.toHexString());
  let governance = getGovernanceEntity();
  transferredNounBRId = event.params.tokenId.toString();

  let transferEvent = new TransferEvent(
    event.transaction.hash.toHexString() + '_' + transferredNounBRId,
  );
  transferEvent.blockNumber = event.block.number;
  transferEvent.blockTimestamp = event.block.timestamp;
  transferEvent.nounbr = event.params.tokenId.toString();
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
    let fromHolderNounsBR = fromHolder.nounsbr; // Re-assignment required to update array
    fromHolder.nounsbr = fromHolderNounsBR.filter(n => n != transferredNounBRId);

    if (fromHolder.delegate != null) {
      let fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate as string);
      let fromHolderNounsBRRepresented = fromHolderDelegate.nounsbrRepresented; // Re-assignment required to update array
      fromHolderDelegate.nounsbrRepresented = fromHolderNounsBRRepresented.filter(
        n => n != transferredNounBRId,
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
  delegateChangedEvent.nounbr = event.params.tokenId.toString();
  delegateChangedEvent.previousDelegate = fromHolder.delegate
    ? fromHolder.delegate!.toString()
    : fromHolder.id.toString();
  delegateChangedEvent.newDelegate = toHolder.delegate
    ? toHolder.delegate!.toString()
    : toHolder.id.toString();
  delegateChangedEvent.save();

  let toHolderDelegate = getOrCreateDelegate(toHolder.delegate ? toHolder.delegate! : toHolder.id);
  let toHolderNounsBRRepresented = toHolderDelegate.nounsbrRepresented; // Re-assignment required to update array
  toHolderNounsBRRepresented.push(transferredNounBRId);
  toHolderDelegate.nounsbrRepresented = toHolderNounsBRRepresented;
  toHolderDelegate.save();

  let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw.plus(BIGINT_ONE);
  toHolder.tokenBalance = toHolder.tokenBalanceRaw;
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw.plus(BIGINT_ONE);
  toHolder.totalTokensHeld = toHolder.totalTokensHeldRaw;
  let toHolderNounsBR = toHolder.nounsbr; // Re-assignment required to update array
  toHolderNounsBR.push(event.params.tokenId.toString());
  toHolder.nounsbr = toHolderNounsBR;

  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.minus(BIGINT_ONE);
    governance.save();
  } else if (toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.plus(BIGINT_ONE);
    governance.save();

    toHolder.delegate = toHolder.id;
  }

  let nounbr = NounBR.load(transferredNounBRId);
  if (nounbr == null) {
    nounbr = new NounBR(transferredNounBRId);
  }

  nounbr.owner = toHolder.id;
  nounbr.save();

  toHolder.save();
}
