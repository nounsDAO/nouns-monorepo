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
import { handleETHStreamedToDAO } from '../src/stream-escrow';
import { createETHStreamedToDAOEvent, ETHStreamedToDAOData, genericUniqueId } from './utils';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';

describe('stream-escrow', () => {
  beforeEach(() => {
    // TODO remove if we don't need
  });

  afterEach(() => {
    clearStore();
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
});
