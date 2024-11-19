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
  handleETHStreamedToDAO,
  handleStreamCreated,
  handleStreamFastForwarded,
} from '../src/stream-escrow';
import {
  createETHStreamedToDAOEvent,
  createStreamCreatedEvent,
  createStreamFastForwardedEvent,
  ETHStreamedToDAOData,
  genericUniqueId,
  StreamCreatedData,
  StreamFastForwardedData,
} from './utils';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { BIGINT_ONE, BIGINT_ZERO } from '../src/utils/constants';
import { StreamsOfNoun } from '../src/types/schema';

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

      const prevStreamPerTick = ed.newEthStreamedPerTick;

      ed.nounId = BigInt.fromI32(2142);
      ed.totalAmount = BigInt.fromI32(2420);
      ed.streamLengthInTicks = BigInt.fromI32(10);
      ed.ethPerTick = BigInt.fromI32(242);
      ed.newEthStreamedPerTick = prevStreamPerTick.plus(ed.ethPerTick);
      ed.lastTick = BigInt.fromI32(10);
      ed.eventBlockNumber = BIGINT_ONE;
      ed.eventBlockTimestamp = BIGINT_ONE;
      handleStreamCreated(createStreamCreatedEvent(ed));
      streamId = genericUniqueId(ed.txHash, ed.logIndex);
      nounId = ed.nounId.toString();

      assert.fieldEquals('Stream', streamId, 'createdTimestamp', ed.eventBlockTimestamp.toString());
      assert.fieldEquals('Stream', streamId, 'createdBlock', ed.eventBlockNumber.toString());
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
    });
    test('fast-forward a stream', () => {
      const ed = new StreamFastForwardedData();
      ed.nounId = BigInt.fromI32(142);
      ed.newLastTick = BigInt.fromI32(6);
      ed.ticksToForward = BigInt.fromI32(4);
      ed.txHash = Bytes.fromI32(9876);
      let nounId = ed.nounId.toString();
      let streamId = StreamsOfNoun.load(nounId)!.currentStream!;

      // Stream state BEFORE
      assert.fieldEquals('Stream', streamId, 'lastTick', BigInt.fromI32(10).toString());
      assert.fieldEquals('Stream', streamId, 'streamLengthInTicks', BigInt.fromI32(10).toString());

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
        ed.nounId.toString(),
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
    });
    test('bla', () => {});
    test('bla', () => {});
  });
});
