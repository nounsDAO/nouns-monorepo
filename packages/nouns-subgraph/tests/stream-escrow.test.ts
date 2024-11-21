import {
  assert,
  clearStore,
  test,
  describe,
  afterAll,
  beforeEach,
  afterEach,
  createMockedFunction,
} from 'matchstick-as/assembly/index';
import {
  handleAllowedToCreateStreamChanged,
  handleDAOExecutorAddressSet,
  handleETHRecipientSet,
  handleETHStreamedToDAO,
  handleNounsRecipientSet,
  handleStreamCanceled,
  handleStreamCreated,
  handleStreamFastForwarded,
  handleStreamsForwarded,
} from '../src/stream-escrow';
import {
  AddressSetData,
  AllowedToCreateStreamChangedData,
  createAllowedToCreateStreamChangedEvent,
  createDAOExecutorAddressSetEvent,
  createETHRecipientSetEvent,
  createETHStreamedToDAOEvent,
  createNounsRecipientSetEvent,
  createStreamCanceledEvent,
  createStreamCreatedEvent,
  createStreamFastForwardedEvent,
  createStreamsForwardedEvent,
  ETHStreamedToDAOData,
  genericUniqueId,
  StreamCanceledData,
  StreamCreatedData,
  StreamFastForwardedData,
  StreamsForwardedData,
} from './utils';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { BIGINT_10K, BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from '../src/utils/constants';
import { StreamCreationPermission, StreamsOfNoun } from '../src/types/schema';
import { getStreamEscrowState } from '../src/utils/helpers';

describe('stream-escrow', () => {
  beforeEach(() => {
    // TODO remove if we don't need
  });

  afterEach(() => {
    // clearStore();
  });

  describe('handleETHStreamedToDAO', () => {
    test('given 2 events, adds 2 individual ETHStreamed entities and updates totalAmountStreamedToDAO', () => {
      const ed = new ETHStreamedToDAOData();
      ed.eventBlockTimestamp = BigInt.fromI32(142);
      ed.eventBlockNumber = BigInt.fromI32(42);
      ed.amount = BigInt.fromI32(1234);
      ed.txHash = Bytes.fromI32(1);
      handleETHStreamedToDAO(createETHStreamedToDAOEvent(ed));

      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed.txHash, ed.logIndex),
        'amount',
        ed.amount.toString(),
      );
      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed.txHash, ed.logIndex),
        'createdTimestamp',
        ed.eventBlockTimestamp.toString(),
      );
      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed.txHash, ed.logIndex),
        'createdBlock',
        ed.eventBlockNumber.toString(),
      );

      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'totalAmountStreamedToDAO',
        ed.amount.toString(),
      );

      const ed2 = new ETHStreamedToDAOData();
      ed2.eventBlockTimestamp = BigInt.fromI32(2142);
      ed2.eventBlockNumber = BigInt.fromI32(242);
      ed2.amount = BigInt.fromI32(21234);
      ed2.txHash = Bytes.fromI32(21);
      handleETHStreamedToDAO(createETHStreamedToDAOEvent(ed2));

      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed2.txHash, ed2.logIndex),
        'amount',
        ed2.amount.toString(),
      );
      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed2.txHash, ed2.logIndex),
        'createdTimestamp',
        ed2.eventBlockTimestamp.toString(),
      );
      assert.fieldEquals(
        'ETHStreamed',
        genericUniqueId(ed2.txHash, ed2.logIndex),
        'createdBlock',
        ed2.eventBlockNumber.toString(),
      );

      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'totalAmountStreamedToDAO',
        ed.amount.plus(ed2.amount).toString(),
      );
    });
  });
  describe('stream lifecycle', () => {
    test('create a couple of streams', () => {
      let es = getStreamEscrowState();
      es.currentTick = BigInt.fromI32(1);
      es.save();

      const ed = new StreamCreatedData();
      ed.nounId = BigInt.fromI32(142);
      ed.totalAmount = BigInt.fromI32(420);
      ed.streamLengthInTicks = BigInt.fromI32(10);
      ed.ethPerTick = BigInt.fromI32(42);
      ed.newEthStreamedPerTick = BigInt.fromI32(42);
      ed.lastTick = BigInt.fromI32(10);
      ed.txHash = Bytes.fromI32(192837);
      handleStreamCreated(createStreamCreatedEvent(ed));
      let streamId = genericUniqueId(ed.txHash, ed.logIndex);
      let nounId = ed.nounId.toString();

      assert.fieldEquals('Stream', streamId, 'createdTimestamp', ed.eventBlockTimestamp.toString());
      assert.fieldEquals('Stream', streamId, 'createdBlock', ed.eventBlockNumber.toString());
      assert.fieldEquals('Stream', streamId, 'startTick', es.currentTick.toString());
      assert.fieldEquals('Stream', streamId, 'noun', ed.nounId.toString());
      assert.fieldEquals('Stream', streamId, 'totalAmount', ed.totalAmount.toString());
      assert.fieldEquals(
        'Stream',
        streamId,
        'streamLengthInTicks',
        ed.streamLengthInTicks.toString(),
      );
      assert.fieldEquals('Stream', streamId, 'ethPerTick', ed.ethPerTick.toString());
      assert.fieldEquals('Stream', streamId, 'lastTick', ed.lastTick.toString());
      assert.fieldEquals('Stream', streamId, 'canceled', false.toString());
      assert.fieldEquals('Stream', streamId, 'cancellationRefundAmount', BIGINT_ZERO.toString());

      assert.fieldEquals('StreamsOfNoun', nounId, 'currentStream', streamId);
      assert.fieldEquals('StreamsOfNoun', nounId, 'pastStreams', '[]');

      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        ed.newEthStreamedPerTick.toString(),
      );

      const prevStreamPerTick = ed.newEthStreamedPerTick;

      es = getStreamEscrowState();
      es.currentTick = BigInt.fromI32(2);
      es.save();

      ed.nounId = BigInt.fromI32(2142);
      ed.totalAmount = BigInt.fromI32(2420);
      ed.streamLengthInTicks = BigInt.fromI32(10);
      ed.ethPerTick = BigInt.fromI32(242);
      ed.newEthStreamedPerTick = prevStreamPerTick.plus(ed.ethPerTick);
      ed.lastTick = BigInt.fromI32(12);
      ed.eventBlockNumber = BIGINT_ONE;
      ed.eventBlockTimestamp = BIGINT_ONE;
      handleStreamCreated(createStreamCreatedEvent(ed));
      streamId = genericUniqueId(ed.txHash, ed.logIndex);
      nounId = ed.nounId.toString();

      assert.fieldEquals('Stream', streamId, 'createdTimestamp', ed.eventBlockTimestamp.toString());
      assert.fieldEquals('Stream', streamId, 'createdBlock', ed.eventBlockNumber.toString());
      assert.fieldEquals('Stream', streamId, 'startTick', es.currentTick.toString());
      assert.fieldEquals('Stream', streamId, 'noun', ed.nounId.toString());
      assert.fieldEquals('Stream', streamId, 'totalAmount', ed.totalAmount.toString());
      assert.fieldEquals(
        'Stream',
        streamId,
        'streamLengthInTicks',
        ed.streamLengthInTicks.toString(),
      );
      assert.fieldEquals('Stream', streamId, 'ethPerTick', ed.ethPerTick.toString());
      assert.fieldEquals('Stream', streamId, 'lastTick', ed.lastTick.toString());
      assert.fieldEquals('Stream', streamId, 'canceled', false.toString());
      assert.fieldEquals('Stream', streamId, 'cancellationRefundAmount', BIGINT_ZERO.toString());

      assert.fieldEquals('StreamsOfNoun', nounId, 'currentStream', streamId);
      assert.fieldEquals('StreamsOfNoun', nounId, 'pastStreams', '[]');

      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        ed.newEthStreamedPerTick.toString(),
      );
    });
    test('fast-forward a stream', () => {
      const ed = new StreamFastForwardedData();
      ed.nounId = BigInt.fromI32(142);
      ed.newLastTick = BigInt.fromI32(6);
      ed.ticksToForward = BigInt.fromI32(4);
      ed.txHash = Bytes.fromI32(9876);
      ed.ethStreamedPerTick = BigInt.fromI32(777);
      let nounId = ed.nounId.toString();
      let streamId = StreamsOfNoun.load(nounId)!.currentStream!;

      // Stream state BEFORE
      assert.fieldEquals('Stream', streamId, 'lastTick', BigInt.fromI32(12).toString());
      assert.fieldEquals('Stream', streamId, 'streamLengthInTicks', BigInt.fromI32(10).toString());

      // General state BEFORE
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        BigInt.fromI32(284).toString(),
      );

      // handle the event
      handleStreamFastForwarded(createStreamFastForwardedEvent(ed));

      assert.fieldEquals(
        'StreamFastforward',
        genericUniqueId(ed.txHash, ed.logIndex),
        'createdTimestamp',
        ed.eventBlockTimestamp.toString(),
      );
      assert.fieldEquals(
        'StreamFastforward',
        genericUniqueId(ed.txHash, ed.logIndex),
        'createdBlock',
        ed.eventBlockNumber.toString(),
      );
      assert.fieldEquals(
        'StreamFastforward',
        genericUniqueId(ed.txHash, ed.logIndex),
        'stream',
        streamId,
      );
      assert.fieldEquals(
        'StreamFastforward',
        genericUniqueId(ed.txHash, ed.logIndex),
        'ticksToForward',
        ed.ticksToForward.toString(),
      );
      assert.fieldEquals(
        'StreamFastforward',
        genericUniqueId(ed.txHash, ed.logIndex),
        'newLastTick',
        ed.newLastTick.toString(),
      );

      // Stream state AFTER
      assert.fieldEquals('Stream', streamId, 'lastTick', ed.newLastTick.toString());
      assert.fieldEquals(
        'Stream',
        streamId,
        'streamLengthInTicks',
        BigInt.fromI32(10).minus(ed.ticksToForward).toString(),
      );

      // General state AFTER
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        ed.ethStreamedPerTick.toString(),
      );
    });
    test('cancel a stream', () => {
      const ed = new StreamCanceledData();
      ed.nounId = BigInt.fromI32(2142);
      ed.amountToRefund = BigInt.fromI32(142000);
      ed.ethStreamedPerTick = BigInt.fromI32(765);
      const nounId = ed.nounId.toString();
      const streamId = StreamsOfNoun.load(nounId)!.currentStream!;

      // General state BEFORE
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        BigInt.fromI32(777).toString(),
      );

      handleStreamCanceled(createStreamCanceledEvent(ed));

      assert.fieldEquals('Stream', streamId, 'canceled', true.toString());
      assert.fieldEquals(
        'Stream',
        streamId,
        'cancellationRefundAmount',
        ed.amountToRefund.toString(),
      );

      // General state AFTER
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        ed.ethStreamedPerTick.toString(),
      );
    });
    test('forward streams', () => {
      const stateBefore = getStreamEscrowState();
      const ed = new StreamsForwardedData();
      ed.currentTick = stateBefore.currentTick.plus(BIGINT_ONE);
      ed.ethPerTickStreamEnded = BIGINT_ZERO;
      ed.nextEthStreamedPerTick = stateBefore.ethStreamedPerTick.plus(BIGINT_ONE);
      ed.lastForwardTimestamp = stateBefore.lastForwardTimestamp.plus(BIGINT_10K);

      handleStreamsForwarded(createStreamsForwardedEvent(ed));

      assert.fieldEquals('StreamEscrowState', 'STATE', 'currentTick', ed.currentTick.toString());
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethStreamedPerTick',
        ed.nextEthStreamedPerTick.toString(),
      );
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'lastForwardTimestamp',
        ed.lastForwardTimestamp.toString(),
      );
    });
  });
  describe('admin events', () => {
    test('handleAllowedToCreateStreamChanged', () => {
      const ed = new AllowedToCreateStreamChangedData();
      ed.address = Address.fromString('0x0000000000000000000000000000000000000001');
      ed.allowed = true;
      const entityId = ed.address.toHexString();

      // Check BEFORE
      assert.assertNull(StreamCreationPermission.load(entityId));

      handleAllowedToCreateStreamChanged(createAllowedToCreateStreamChangedEvent(ed));

      assert.fieldEquals('StreamCreationPermission', entityId, 'allowed', ed.allowed.toString());
    });
    test('handleDAOExecutorAddressSet', () => {
      const ed = new AddressSetData();
      ed.eventBlockNumber = BigInt.fromI32(1234);
      ed.newAddress = Address.fromString('0x0000000000000000000000000000000000000001');

      // Check BEFORE
      assert.fieldEquals('StreamEscrowState', 'STATE', 'daoExecutor', ZERO_ADDRESS);
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'daoExecutorSetBlock',
        BIGINT_ZERO.toString(),
      );

      handleDAOExecutorAddressSet(createDAOExecutorAddressSetEvent(ed));

      // Check AFTER
      assert.fieldEquals('StreamEscrowState', 'STATE', 'daoExecutor', ed.newAddress.toHexString());
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'daoExecutorSetBlock',
        ed.eventBlockNumber.toString(),
      );
    });
    test('handleETHRecipientSet', () => {
      const ed = new AddressSetData();
      ed.eventBlockNumber = BigInt.fromI32(1234);
      ed.newAddress = Address.fromString('0x0000000000000000000000000000000000000001');

      // Check BEFORE
      assert.fieldEquals('StreamEscrowState', 'STATE', 'ethRecipient', ZERO_ADDRESS);
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethRecipientSetBlock',
        BIGINT_ZERO.toString(),
      );

      handleETHRecipientSet(createETHRecipientSetEvent(ed));

      // Check AFTER
      assert.fieldEquals('StreamEscrowState', 'STATE', 'ethRecipient', ed.newAddress.toHexString());
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'ethRecipientSetBlock',
        ed.eventBlockNumber.toString(),
      );
    });
    test('handleNounsRecipientSet', () => {
      const ed = new AddressSetData();
      ed.eventBlockNumber = BigInt.fromI32(1234);
      ed.newAddress = Address.fromString('0x0000000000000000000000000000000000000001');

      // Check BEFORE
      assert.fieldEquals('StreamEscrowState', 'STATE', 'nounsRecipient', ZERO_ADDRESS);
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'nounsRecipientSetBlock',
        BIGINT_ZERO.toString(),
      );

      handleNounsRecipientSet(createNounsRecipientSetEvent(ed));

      // Check AFTER
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'nounsRecipient',
        ed.newAddress.toHexString(),
      );
      assert.fieldEquals(
        'StreamEscrowState',
        'STATE',
        'nounsRecipientSetBlock',
        ed.eventBlockNumber.toString(),
      );
    });
  });
});
