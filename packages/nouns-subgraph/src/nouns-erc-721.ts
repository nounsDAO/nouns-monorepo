import { log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  NounCreated,
  Transfer,
} from './types/NounsToken/NounsToken';
import { Noun, Seed, DelegationEvent, TransferEvent } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handleNounCreated(event: NounCreated): void {
  let nounId = event.params.tokenId.toString();

  let seed = new Seed(nounId);
  seed.background = event.params.seed.background;
  seed.body = event.params.seed.body;
  seed.accessory = event.params.seed.accessory;
  seed.head = event.params.seed.head;
  seed.glasses = event.params.seed.glasses;
  seed.save();

  let noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleNounCreated] Noun #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  noun.seed = seed.id;
  noun.save();
}

// Use WebAssembly global due to lack of closure support
let accountNouns: string[] = [];

export function handleDelegateChanged(event: DelegateChanged): void {
  let tokenHolder = getOrCreateAccount(event.params.delegator.toHexString());
  let previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  let newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  accountNouns = tokenHolder.nouns;

  tokenHolder.delegate = newDelegate.id;
  tokenHolder.save();

  previousDelegate.tokenHoldersRepresentedAmount =
    previousDelegate.tokenHoldersRepresentedAmount - 1;
  let previousNounsRepresented = previousDelegate.nounsRepresented; // Re-assignment required to update array
  previousDelegate.nounsRepresented = previousNounsRepresented.filter(
    n => !accountNouns.includes(n),
  );
  newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
  let newNounsRepresented = newDelegate.nounsRepresented; // Re-assignment required to update array
  for (let i = 0; i < accountNouns.length; i++) {
    newNounsRepresented.push(accountNouns[i]);
  }
  newDelegate.nounsRepresented = newNounsRepresented;
  previousDelegate.save();
  newDelegate.save();

  // Log a transfer event for each Noun
  for (let i = 0; i < accountNouns.length; i++) {
    let delegateChangedEvent = new DelegationEvent(
      event.transaction.hash.toHexString() + '_' + accountNouns[i],
    );
    delegateChangedEvent.blockNumber = event.block.number;
    delegateChangedEvent.blockTimestamp = event.block.timestamp;
    delegateChangedEvent.noun = accountNouns[i];
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

let transferredNounId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  let fromHolder = getOrCreateAccount(event.params.from.toHexString());
  let toHolder = getOrCreateAccount(event.params.to.toHexString());
  let governance = getGovernanceEntity();
  transferredNounId = event.params.tokenId.toString();


  let transferEvent = new TransferEvent(event.transaction.hash.toHexString() + "_" + transferredNounId);
  transferEvent.blockNumber = event.block.number;
  transferEvent.blockTimestamp = event.block.timestamp;
  transferEvent.noun = event.params.tokenId.toString();
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
    let fromHolderNouns = fromHolder.nouns; // Re-assignment required to update array
    fromHolder.nouns = fromHolderNouns.filter(n => n != transferredNounId);

    if (fromHolder.delegate != null) {
      let fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate);
      let fromHolderNounsRepresented = fromHolderDelegate.nounsRepresented; // Re-assignment required to update array
      fromHolderDelegate.nounsRepresented = fromHolderNounsRepresented.filter(
        n => n != transferredNounId,
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
  delegateChangedEvent.noun = event.params.tokenId.toString();
  delegateChangedEvent.previousDelegate = fromHolder.delegate
    ? fromHolder.delegate.toString()
    : fromHolder.id.toString();
  delegateChangedEvent.newDelegate = toHolder.delegate
    ? toHolder.delegate.toString()
    : toHolder.id.toString();
  delegateChangedEvent.save();

  let toHolderDelegate = getOrCreateDelegate(toHolder.delegate ? toHolder.delegate: toHolder.id);
  let toHolderNounsRepresented = toHolderDelegate.nounsRepresented; // Re-assignment required to update array
  toHolderNounsRepresented.push(transferredNounId);
  toHolderDelegate.nounsRepresented = toHolderNounsRepresented;
  toHolderDelegate.save();

  let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw + BIGINT_ONE;
  toHolder.tokenBalance = toHolder.tokenBalanceRaw;
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw + BIGINT_ONE;
  toHolder.totalTokensHeld = toHolder.totalTokensHeldRaw;
  let toHolderNouns = toHolder.nouns; // Re-assignment required to update array
  toHolderNouns.push(event.params.tokenId.toString());
  toHolder.nouns = toHolderNouns;

  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders - BIGINT_ONE;
    governance.save();
  } else if (toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders + BIGINT_ONE;
    governance.save();

    toHolder.delegate = toHolder.id;
  }

  let noun = Noun.load(transferredNounId);
  if (noun == null) {
    noun = new Noun(transferredNounId);
  }

  noun.owner = toHolder.id;
  noun.save();

  toHolder.save();
}
