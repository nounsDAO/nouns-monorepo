import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  Transfer,
} from './types/WrappedPunk/WrappedPunk';
import { OGPunk, Account } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getOrCreateAccount } from './utils/helpers';


let transferredPunkId: string; // Use WebAssembly global due to lack of closure support
export function handleTransfer(event: Transfer): void {
  let prevOwner: Account;
  let newOwner: Account;
  transferredPunkId = event.params.tokenId.toString();
  let ogpunk = OGPunk.load(transferredPunkId);

  if (event.params.from.toHexString() == ZERO_ADDRESS) { // mint/wrap
    ogpunk.wrapped = true;
    prevOwner = getOrCreateAccount(event.address.toHexString());
  } else {
    prevOwner = getOrCreateAccount(event.params.from.toHexString());
  }

  prevOwner.ogpunkBalanceRaw = prevOwner.ogpunkBalanceRaw - BIGINT_ONE;
  prevOwner.ogpunkBalance = prevOwner.ogpunkBalanceRaw;
  let prevOGPunks = prevOwner.ogpunks; // Re-assignment required to update array
  prevOwner.ogpunks = prevOGPunks.filter(
    n => n != transferredPunkId,
  );
  prevOwner.save();

  if (event.params.to.toHexString() == ZERO_ADDRESS) { // burn/unwrap
    ogpunk.wrapped = false;
    newOwner = getOrCreateAccount(event.address.toHexString());
  } else {
    newOwner = getOrCreateAccount(event.params.to.toHexString());
  }

  ogpunk.owner = newOwner.id;
  ogpunk.save();

  newOwner.ogpunkBalanceRaw = newOwner.ogpunkBalanceRaw + BIGINT_ONE;
  newOwner.ogpunkBalance = newOwner.ogpunkBalanceRaw;
  let newOGPunks = newOwner.ogpunks; // Re-assignment required to update array
  newOGPunks.push(ogpunk.id);
  newOwner.ogpunks = newOGPunks;
  newOwner.save();
}
