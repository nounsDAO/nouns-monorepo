import { ETHStreamed, Stream, StreamFastforward } from './types/schema';
import {
  AllowedToCreateStreamChanged,
  DAOExecutorAddressSet,
  ETHRecipientSet,
  ETHStreamedToDAO,
  NounsRecipientSet,
  StreamCanceled,
  StreamCreated,
  StreamFastForwarded,
  StreamsForwarded,
} from './types/StreamEscrow/StreamEscrow';
import { BIGINT_ZERO } from './utils/constants';
import {
  genericUniqueId,
  getCurrentStream,
  getOrCreateStreamCreationPermission,
  getOrCreateStreamsOfNoun,
  getStreamEscrowState,
} from './utils/helpers';

export function handleETHStreamedToDAO(event: ETHStreamedToDAO): void {
  const es = new ETHStreamed(genericUniqueId(event));
  es.amount = event.params.amount;
  es.createdTimestamp = event.block.timestamp;
  es.createdBlock = event.block.number;
  es.save();

  const s = getStreamEscrowState();
  s.totalAmountStreamedToDAO = s.totalAmountStreamedToDAO.plus(event.params.amount);
  s.save();
}

export function handleStreamCreated(event: StreamCreated): void {
  const nounId = event.params.nounId.toString();
  const streamId = genericUniqueId(event);

  const s = new Stream(streamId);
  s.createdTimestamp = event.block.timestamp;
  s.createdBlock = event.block.number;
  s.noun = nounId;
  s.totalAmount = event.params.totalAmount;
  s.streamLengthInTicks = event.params.streamLengthInTicks;
  s.ethPerTick = event.params.ethPerTick;
  s.lastTick = event.params.lastTick;
  s.canceled = false;
  s.cancellationRefundAmount = BIGINT_ZERO;
  s.save();

  const son = getOrCreateStreamsOfNoun(nounId);
  if (son.currentStream != null) {
    son.pastStreams.push(son.currentStream!);
  }
  son.currentStream = s.id;
  son.save();
}

export function handleStreamFastForwarded(event: StreamFastForwarded): void {
  const nounId = event.params.nounId.toString();

  const ff = new StreamFastforward(genericUniqueId(event));
  ff.createdTimestamp = event.block.timestamp;
  ff.createdBlock = event.block.number;
  ff.stream = nounId;
  ff.ticksToForward = event.params.ticksToForward;
  ff.newLastTick = event.params.newLastTick;
  ff.save();

  const s = getCurrentStream(nounId);
  s.lastTick = event.params.newLastTick;
  s.streamLengthInTicks = s.streamLengthInTicks - event.params.ticksToForward.toI32();
  s.save();
}

export function handleStreamCanceled(event: StreamCanceled): void {
  const nounId = event.params.nounId.toString();

  const s = getCurrentStream(nounId);
  s.canceled = true;
  s.cancellationRefundAmount = event.params.amountToRefund;
  s.save();
}

export function handleStreamsForwarded(event: StreamsForwarded): void {
  const s = getStreamEscrowState();
  s.currentTick = event.params.currentTick;
  s.ethStreamedPerTick = event.params.nextEthStreamedPerTick;
  s.lastForwardTimestamp = event.params.lastForwardTimestamp;
  s.save();
}

export function handleAllowedToCreateStreamChanged(event: AllowedToCreateStreamChanged): void {
  const p = getOrCreateStreamCreationPermission(event.params.address_.toHexString());
  p.allowed = event.params.allowed;
  p.save();
}

export function handleDAOExecutorAddressSet(event: DAOExecutorAddressSet): void {
  const s = getStreamEscrowState();
  s.daoExecutor = event.params.newAddress.toHexString();
  s.daoExecutorSetBlock = event.block.number;
  s.save();
}

export function handleETHRecipientSet(event: ETHRecipientSet): void {
  const s = getStreamEscrowState();
  s.ethRecipient = event.params.newAddress.toHexString();
  s.ethRecipientSetBlock = event.block.number;
  s.save();
}

export function handleNounsRecipientSet(event: NounsRecipientSet): void {
  const s = getStreamEscrowState();
  s.nounsRecipient = event.params.newAddress.toHexString();
  s.nounsRecipientSetBlock = event.block.number;
  s.save();
}
