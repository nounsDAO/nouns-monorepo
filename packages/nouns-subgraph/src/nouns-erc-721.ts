import { Bytes, ipfs, json, JSONValueKind, log } from '@graphprotocol/graph-ts';
import {
  DelegateChanged,
  DelegateVotesChanged,
  NounCreated,
  Transfer,
  NounsToken as NounsTokenContract,
} from '../generated/NounsToken/NounsToken';
import { Noun, NounAttributes } from '../generated/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getGovernanceEntity, getOrCreateDelegate, getOrCreateAccount } from './utils/helpers';

export function handleNounCreated(event: NounCreated): void {
  let nounId = event.params.tokenId.toString();
  let contract = NounsTokenContract.bind(event.address);

  let noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleNounCreated] Noun #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  const uri = contract.try_tokenURI(event.params.tokenId);
  if (!uri.reverted) {
    noun.tokenUri = uri.value;
    if (noun.tokenUri.includes('ipfs/')) {
      let tokenHash = noun.tokenUri.split('ipfs/')[1];
      let tokenBytes = ipfs.cat(tokenHash);
      if (tokenBytes) {
        let data = json.try_fromBytes(tokenBytes as Bytes);
        if (data.isOk) {
          if (data.value.kind == JSONValueKind.OBJECT) {
            let res = data.value.toObject();
            if (res.get('image').kind == JSONValueKind.STRING) {
              noun.image = res.get('image').toString();
            }
            if (res.get('animation_url').kind == JSONValueKind.STRING) {
              noun.animation = res.get('animation_url').toString();
            }
            if (res.get('name').kind == JSONValueKind.STRING) {
              noun.name = res.get('name').toString();
            }
            if (res.get('description').kind == JSONValueKind.STRING) {
              noun.description = res.get('description').toString();
            }
            if (res.get('attributes').kind == JSONValueKind.ARRAY) {
              let attributes = res.get('attributes').toArray();
              for (let i = 0; i < attributes.length; i += 1) {
                if (attributes[i].kind == JSONValueKind.OBJECT) {
                  let attribute = attributes[i].toObject();
                  let nounAttributes = new NounAttributes('noun-' + noun.id + i.toString());
                  nounAttributes.trait = null;
                  nounAttributes.value = null;

                  if (attribute.get('trait_type').kind == JSONValueKind.STRING) {
                    nounAttributes.trait = attribute.get('trait_type').toString();
                  }
                  if (attribute.get('value').kind == JSONValueKind.STRING) {
                    nounAttributes.value = attribute.get('value').toString();
                  }
                  nounAttributes.save();
                  let attrs = noun.attributes;
                  attrs.push(nounAttributes.id);
                  noun.attributes = attrs;
                }
              }
            }
          }
        }
      }
    }
  }

  noun.save();
}

let accountNouns: string[] = []; // Use WebAssembly global due to lack of closure support
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

  // fromHolder
  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    governance.totalTokenHolders = governance.totalTokenHolders + BIGINT_ONE;
    governance.save();
  } else {
    let fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw = fromHolder.tokenBalanceRaw - BIGINT_ONE;
    fromHolder.tokenBalance = fromHolder.tokenBalanceRaw;
    let fromHolderNouns = fromHolder.nouns; // Re-assignment required to update array
    fromHolder.nouns = fromHolderNouns.filter(n => n !== transferredNounId);

    if (fromHolder.delegate != null) {
      let fromHolderDelegate = getOrCreateDelegate(fromHolder.delegate);
      let fromHolderNounsRepresented = fromHolderDelegate.nounsRepresented; // Re-assignment required to update array
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

  let toHolderDelegate = getOrCreateDelegate(toHolder.id);
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
