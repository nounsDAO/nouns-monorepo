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
import { genericUniqueId, getStreamEscrowState } from './utils/helpers';

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
  const s = new Stream(nounId);
  s.createdTimestamp = event.block.timestamp;
  s.createdBlock = event.block.number;
  s.noun = nounId;
  s.totalAmount = event.params.totalAmount;
  s.streamLengthInTicks = event.params.streamLengthInTicks;
  s.ethPerTick = event.params.ethPerTick;
  s.lastTick = event.params.lastTick;
  s.canceled = false;
  s.save();
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

  const s = Stream.load(nounId)!;
  s.lastTick = event.params.newLastTick;
  s.streamLengthInTicks = s.streamLengthInTicks - event.params.ticksToForward.toI32();
  s.save();
}

export function handleStreamCanceled(event: StreamCanceled): void {}

export function handleStreamsForwarded(event: StreamsForwarded): void {}

export function handleAllowedToCreateStreamChanged(event: AllowedToCreateStreamChanged): void {}

export function handleDAOExecutorAddressSet(event: DAOExecutorAddressSet): void {}

export function handleETHRecipientSet(event: ETHRecipientSet): void {}

export function handleNounsRecipientSet(event: NounsRecipientSet): void {}
