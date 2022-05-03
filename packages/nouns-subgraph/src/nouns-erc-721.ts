import { log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  NounCreated,
  Transfer,
  TokenUriSet,
} from './types/NounsToken/NounsToken';
import { Noun, Seed } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handleNounCreated(event: NounCreated): void {
  const nounId = event.params.tokenId.toString();

  const seed = new Seed(nounId);
  seed.volumeCount = event.params.seed.volumeCount;
  seed.maxVolumeHeight = event.params.seed.maxVolumeHeight;
  seed.waterFeatureCount = event.params.seed.waterFeatureCount;
  seed.grassFeatureCount = event.params.seed.grassFeatureCount;
  seed.treeCount = event.params.seed.treeCount;
  seed.bushCount = event.params.seed.bushCount;
  seed.peopleCount = event.params.seed.peopleCount;
  seed.timeOfDay = event.params.seed.timeOfDay;
  seed.season = event.params.seed.season;
  seed.greenRooftopP = event.params.seed.greenRooftopP;
  seed.siteEdgeOffset = event.params.seed.siteEdgeOffset;
  seed.orientation = event.params.seed.orientation;
  seed.save();

  const noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleNounCreated] Nouns #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  noun.seed = seed.id;
  noun.save();
}

export function handleTokenUriSet(event: TokenUriSet): void {
  const nounId = event.params.tokenId.toString();

  const noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleTokenUriSet] Nouns #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  noun.uri = event.params.uri.toString();
  noun.save();
}

let accountNouns: string[] = []; // Use WebAssembly global due to lack of closure support
export function handleDelegateChanged(event: DelegateChanged): void {
  const tokenHolder = getOrCreateAccount(event.params.delegator.toHexString());
  const previousDelegate = getOrCreateDelegate(event.params.fromDelegate.toHexString());
  const newDelegate = getOrCreateDelegate(event.params.toDelegate.toHexString());
  accountNouns = tokenHolder.nouns;

  tokenHolder.delegate = newDelegate.id;
  tokenHolder.save();

  previousDelegate.tokenHoldersRepresentedAmount =
    previousDelegate.tokenHoldersRepresentedAmount - 1;
  const previousNounsRepresented = previousDelegate.nounsRepresented; // Re-assignment required to update array
  previousDelegate.nounsRepresented = previousNounsRepresented.filter(
    n => !accountNouns.includes(n),
  );
  newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
  const newNounsRepresented = newDelegate.nounsRepresented; // Re-assignment required to update array
  for (let i = 0; i < accountNouns.length; i++) {
    newNounsRepresented.push(accountNouns[i]);
  }
  newDelegate.nounsRepresented = newNounsRepresented;
  previousDelegate.save();
  newDelegate.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {
  const governance = getGovernanceEntity();
  const delegate = getOrCreateDelegate(event.params.delegate.toHexString());
  const votesDifference = event.params.newBalance.minus(event.params.previousBalance);

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

let transferredNounId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  const fromHolder = getOrCreateAccount(event.params.from.toHexString());
  const toHolder = getOrCreateAccount(event.params.to.toHexString());
  const governance = getGovernanceEntity();
  transferredNounId = event.params.tokenId.toString();

  // fromHolder
  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders.plus(BIGINT_ONE);
    governance.save();
  } else {
    const fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw = fromHolder.tokenBalanceRaw.minus(BIGINT_ONE);
    fromHolder.tokenBalance = fromHolder.tokenBalanceRaw;
    const fromHolderNouns = fromHolder.nouns; // Re-assignment required to update array
    fromHolder.nouns = fromHolderNouns.filter(n => n !== transferredNounId);

    if (fromHolder.delegate != null) {
      const fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate);
      const fromHolderNounsRepresented = fromHolderDelegate.nounsRepresented; // Re-assignment required to update array
      fromHolderDelegate.nounsRepresented = fromHolderNounsRepresented.filter(
        n => n !== transferredNounId,
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

  const toHolderDelegate = getOrCreateDelegate(toHolder.id);
  const toHolderNounsRepresented = toHolderDelegate.nounsRepresented; // Re-assignment required to update array
  toHolderNounsRepresented.push(transferredNounId);
  toHolderDelegate.nounsRepresented = toHolderNounsRepresented;
  toHolderDelegate.save();

  const toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw.plus(BIGINT_ONE);
  toHolder.tokenBalance = toHolder.tokenBalanceRaw;
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw.plus(BIGINT_ONE);
  toHolder.totalTokensHeld = toHolder.totalTokensHeldRaw;
  const toHolderNouns = toHolder.nouns; // Re-assignment required to update array
  toHolderNouns.push(event.params.tokenId.toString());
  toHolder.nouns = toHolderNouns;

  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.minus(BIGINT_ONE);
    governance.save();
  } else if (toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
    governance.currentTokenHolders = governance.currentTokenHolders.plus(BIGINT_ONE);
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
