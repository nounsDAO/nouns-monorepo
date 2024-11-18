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

export function handleETHStreamedToDAO(event: ETHStreamedToDAO): void {}

export function handleStreamCreated(event: StreamCreated): void {}

export function handleStreamFastForwarded(event: StreamFastForwarded): void {}

export function handleStreamCanceled(event: StreamCanceled): void {}

export function handleStreamsForwarded(event: StreamsForwarded): void {}

export function handleAllowedToCreateStreamChanged(event: AllowedToCreateStreamChanged): void {}

export function handleDAOExecutorAddressSet(event: DAOExecutorAddressSet): void {}

export function handleETHRecipientSet(event: ETHRecipientSet): void {}

export function handleNounsRecipientSet(event: NounsRecipientSet): void {}
