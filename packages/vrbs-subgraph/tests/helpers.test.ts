import { assert, clearStore, test } from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_10K, BIGINT_ONE } from '../src/utils/constants';
import { getOrCreateDynamicQuorumParams } from '../src/utils/helpers';

test('getOrCreateDynamicQuorumParams: sets dynamicQuorumStartBlock to null', () => {
  const params = getOrCreateDynamicQuorumParams();

  assert.assertTrue(params.dynamicQuorumStartBlock === null);

  clearStore();
});

test('getOrCreateDynamicQuorumParams: sets dynamicQuorumStartBlock to input block number', () => {
  const params = getOrCreateDynamicQuorumParams(BIGINT_10K);

  assert.bigIntEquals(BIGINT_10K, params.dynamicQuorumStartBlock as BigInt);

  clearStore();
});

test('getOrCreateDynamicQuorumParams: sets dynamicQuorumStartBlock first number after first being null, and later attempt to set to a different number', () => {
  let params = getOrCreateDynamicQuorumParams();
  assert.assertTrue(params.dynamicQuorumStartBlock === null);

  params = getOrCreateDynamicQuorumParams(BIGINT_ONE);
  assert.bigIntEquals(BIGINT_ONE, params.dynamicQuorumStartBlock as BigInt);

  params = getOrCreateDynamicQuorumParams(BIGINT_10K);
  assert.bigIntEquals(BIGINT_ONE, params.dynamicQuorumStartBlock as BigInt);

  clearStore();
});
