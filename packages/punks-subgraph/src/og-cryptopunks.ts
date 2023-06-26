import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  Assign,
  PunkTransfer,
} from './types/OGCryptopunks/OGCryptopunks';
import { OGPunk } from './types/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './utils/constants';
import { getOrCreateAccount } from './utils/helpers';


export function handleOGPunkAssign(event: Assign): void {
  let owner = getOrCreateAccount(event.params.to.toHexString());
  let ogpunk = new OGPunk(event.params.punkIndex.toString());

  ogpunk.owner = owner.id;
  ogpunk.wrapped = false;
  ogpunk.save();

  owner.ogpunkBalanceRaw = owner.ogpunkBalanceRaw + BIGINT_ONE;
  owner.ogpunkBalance = owner.ogpunkBalanceRaw;
  let newOGPunks = owner.ogpunks; // Re-assignment required to update array
  newOGPunks.push(ogpunk.id);
  owner.ogpunks = newOGPunks;
  owner.save();
}

let transferredPunkId: string; // Use WebAssembly global due to lack of closure support
export function handleOGPunkTransfer(event: PunkTransfer): void {
  let prevOwner = getOrCreateAccount(event.params.from.toHexString());
  let newOwner = getOrCreateAccount(event.params.to.toHexString());
  transferredPunkId = event.params.punkIndex.toString();
  let ogpunk = OGPunk.load(transferredPunkId);

  prevOwner.ogpunkBalanceRaw = prevOwner.ogpunkBalanceRaw - BIGINT_ONE;
  prevOwner.ogpunkBalance = prevOwner.ogpunkBalanceRaw;
  let prevOGPunks = prevOwner.ogpunks; // Re-assignment required to update array
  prevOwner.ogpunks = prevOGPunks.filter(
    n => n != transferredPunkId,
  );
  prevOwner.save();

  ogpunk.owner = newOwner.id;
  ogpunk.save();

  newOwner.ogpunkBalanceRaw = newOwner.ogpunkBalanceRaw + BIGINT_ONE;
  newOwner.ogpunkBalance = newOwner.ogpunkBalanceRaw;
  let newOGPunks = newOwner.ogpunks; // Re-assignment required to update array
  newOGPunks.push(ogpunk.id);
  newOwner.ogpunks = newOGPunks;
  newOwner.save();
}
