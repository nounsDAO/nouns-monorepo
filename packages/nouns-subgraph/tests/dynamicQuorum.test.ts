import { assert, test } from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_ZERO } from '../src/utils/constants';
import { dynamicQuorumVotes } from '../src/utils/dynamicQuorum';

test('dynamicQuorumVotes: coefficient set to zero', () => {
  const quorum = dynamicQuorumVotes(
    BigInt.fromI32(12),
    BigInt.fromI32(200),
    1000,
    4000,
    BIGINT_ZERO,
  );

  assert.bigIntEquals(BigInt.fromI32(20), quorum);
});

test('dynamicQuorumVotes: increases linearly', () => {
  const quorum = dynamicQuorumVotes(
    BigInt.fromI32(18),
    BigInt.fromI32(200),
    1000,
    4000,
    BigInt.fromI32(1_000_000),
  );

  assert.bigIntEquals(BigInt.fromI32(38), quorum);
});

test('dynamicQuorumVotes: capped at max', () => {
  assert.bigIntEquals(
    BigInt.fromI32(200),
    dynamicQuorumVotes(
      BigInt.fromI32(60),
      BigInt.fromI32(200),
      1000,
      10000,
      BigInt.fromI32(3_000_000),
    ),
  );

  assert.bigIntEquals(
    BigInt.fromI32(80),
    dynamicQuorumVotes(
      BigInt.fromI32(30),
      BigInt.fromI32(200),
      1000,
      4000,
      BigInt.fromI32(2_000_000),
    ),
  );
});
