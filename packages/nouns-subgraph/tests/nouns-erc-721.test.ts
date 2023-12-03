import {
  assert,
  clearStore,
  test,
  describe,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  createTransferEvent,
  createDelegateChangedEvent,
  createDelegateVotesChangedEvent,
} from './utils';
import { BIGINT_ONE, BIGINT_ZERO } from '../src/utils/constants';
import { getOrCreateDelegate, getOrCreateAccount } from '../src/utils/helpers';
import {
  handleDelegateChanged,
  handleDelegateVotesChanged,
  handleTransfer,
} from '../src/nouns-erc-721';

const someAddress = Address.fromString('0x0000000000000000000000000000000000000001');
const freshHolderAddress = Address.fromString('0x0000000000000000000000000000000000000002');
const popularDelegate = Address.fromString('0x0000000000000000000000000000000000000003');
const BLACKHOLE_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000');

const txHash = Bytes.fromI32(11);
const logIndex = BigInt.fromI32(3);
const updateBlockTimestamp = BigInt.fromI32(946684800);
const updateBlockNumber = BigInt.fromI32(15537394);

afterEach(() => {
  clearStore();
});

describe('nouns-erc-721', () => {
  describe('Delegate changes', () => {
    beforeEach(() => {
      const delegate = getOrCreateDelegate(someAddress.toHexString());
      delegate.tokenHoldersRepresentedAmount = 1;
      delegate.delegatedVotes = BIGINT_ONE;
      delegate.delegatedVotesRaw = BIGINT_ONE;
      delegate.save();

      const account = getOrCreateAccount(someAddress.toHexString());
      account.tokenBalance = BIGINT_ONE;
      account.tokenBalanceRaw = BIGINT_ONE;
      account.nouns = ['1'];
      account.save();
    });

    afterAll(() => {
      clearStore();
    });

    test('after having delegated votes, transferring all nouns avoids nulling account delegate', () => {
      const delegateChangeEvent = createDelegateChangedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        someAddress,
        someAddress,
        popularDelegate,
      );

      handleDelegateChanged(delegateChangeEvent);

      assert.fieldEquals(
        'Account',
        someAddress.toHexString(),
        'delegate',
        popularDelegate.toHexString(),
      );
      assert.fieldEquals('Delegate', popularDelegate.toHexString(), 'nounsRepresented', '[1]');

      const randomDelegateIncreateVoteEvent = createDelegateVotesChangedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        popularDelegate,
        BIGINT_ZERO,
        BIGINT_ONE,
      );

      const accountDelegateDecreaseVoteEvent = createDelegateVotesChangedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        someAddress,
        BIGINT_ONE,
        BIGINT_ZERO,
      );

      handleDelegateVotesChanged(randomDelegateIncreateVoteEvent);
      handleDelegateVotesChanged(accountDelegateDecreaseVoteEvent);

      assert.fieldEquals('Delegate', popularDelegate.toHexString(), 'delegatedVotes', '1');
      assert.fieldEquals('Delegate', someAddress.toHexString(), 'delegatedVotes', '0');

      const transferEvent = createTransferEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        someAddress,
        BLACKHOLE_ADDRESS,
        BIGINT_ONE,
      );

      const randomDelegateDecreateVoteEvent = createDelegateVotesChangedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        popularDelegate,
        BIGINT_ONE,
        BIGINT_ZERO,
      );

      handleTransfer(transferEvent);
      handleDelegateVotesChanged(randomDelegateDecreateVoteEvent);

      assert.fieldEquals('Account', someAddress.toHexString(), 'tokenBalance', '0');
      assert.fieldEquals(
        'Account',
        someAddress.toHexString(),
        'delegate',
        popularDelegate.toHexString(),
      );
      assert.fieldEquals('Delegate', popularDelegate.toHexString(), 'nounsRepresented', '[]');
      assert.fieldEquals('Delegate', popularDelegate.toHexString(), 'delegatedVotes', '0');
    });

    test('transfer events from account with delegation ignore delegate changes', () => {
      const delegateChangeEvent = createDelegateChangedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        someAddress,
        someAddress,
        popularDelegate,
      );

      handleDelegateChanged(delegateChangeEvent);

      assert.fieldEquals(
        'Account',
        someAddress.toHexString(),
        'delegate',
        popularDelegate.toHexString(),
      );

      const selloutEvent = createTransferEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        someAddress,
        BLACKHOLE_ADDRESS,
        BIGINT_ONE,
      );

      handleTransfer(selloutEvent);

      assert.fieldEquals(
        'Account',
        someAddress.toHexString(),
        'delegate',
        popularDelegate.toHexString(),
      );

      const buybackEvent = createTransferEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        BLACKHOLE_ADDRESS,
        someAddress,
        BIGINT_ONE,
      );

      handleTransfer(buybackEvent);

      assert.fieldEquals(
        'Account',
        someAddress.toHexString(),
        'delegate',
        popularDelegate.toHexString(),
      );
    });

    test('fresh new token holder self-delegates by default', () => {
      const account = getOrCreateAccount(freshHolderAddress.toHexString());
      account.save();

      const buyNounEvent = createTransferEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        BLACKHOLE_ADDRESS,
        freshHolderAddress,
        BIGINT_ONE,
      );

      handleTransfer(buyNounEvent);

      assert.fieldEquals('Account', freshHolderAddress.toHexString(), 'tokenBalance', '1');

      assert.fieldEquals(
        'Account',
        freshHolderAddress.toHexString(),
        'delegate',
        freshHolderAddress.toHexString(),
      );
    });
  });
});
