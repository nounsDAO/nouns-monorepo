import { log } from '@graphprotocol/graph-ts';
import { NounCreated, Transfer } from './types/NounsERC721/NounsERC721';
import { Account, Noun, Seed } from './types/schema';

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

export function handleNounTransferred(event: Transfer): void {
  let nounId = event.params.tokenId.toString();
  let toAddress = event.params.to.toHex();

  let to = Account.load(toAddress);
  if (to == null) {
    to = new Account(toAddress);
    to.save();
  }

  let noun = Noun.load(nounId);
  if (noun == null) {
    noun = new Noun(nounId);
  }

  noun.owner = to.id;
  noun.save();
}
