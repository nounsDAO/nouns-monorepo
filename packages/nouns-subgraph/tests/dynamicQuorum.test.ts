import { assert, test } from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_ZERO } from '../src/utils/constants';
import { dynamicQuorumVotes } from '../src/utils/dynamicQuorum';

test('dynamicQuorumVotes: coefs all zeroes', () => {
  const quorum = dynamicQuorumVotes(
    12,
    BigInt.fromI32(200),
    1000,
    4000,
    500,
    BIGINT_ZERO,
    BIGINT_ZERO,
  );

  assert.bigIntEquals(BigInt.fromI32(20), quorum);
});

test('dynamicQuorumVotes: linear, stays flat before the offset', () => {
  // 1M is 1 in 1e6 fixed point
  const quorum = dynamicQuorumVotes(
    6,
    BigInt.fromI32(200),
    1000,
    4000,
    500,
    BigInt.fromI32(1_000_000),
    BIGINT_ZERO,
  );

  assert.bigIntEquals(BigInt.fromI32(20), quorum);
});

test('dynamicQuorumVotes: linear, increases linearly past the offset value', () => {
  const quorum = dynamicQuorumVotes(
    18,
    BigInt.fromI32(200),
    1000,
    4000,
    500,
    BigInt.fromI32(1000000),
    BIGINT_ZERO,
  );

  assert.bigIntEquals(BigInt.fromI32(28), quorum);
});

test('dynamicQuorumVotes: quadratic, increases quadratically', () => {
  // 1000 is 0.001 in 1e6 fixed point
  const quorum = dynamicQuorumVotes(
    26,
    BigInt.fromI32(200),
    1000,
    4000,
    500,
    BIGINT_ZERO,
    BigInt.fromI32(1000),
  );

  assert.bigIntEquals(BigInt.fromI32(32), quorum);
});

test('dynamicQuorumVotes: quadratic, with both coefs', () => {
  // 1000 is 0.001 in 1e6 fixed point
  // 300K is 0.3 in 1e6
  const linearCoefficient = BigInt.fromI32(300000);
  const quadraticCoefficient = BigInt.fromI32(1000);

  assert.bigIntEquals(
    BigInt.fromI32(20),
    dynamicQuorumVotes(
      10,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
  assert.bigIntEquals(
    BigInt.fromI32(28),
    dynamicQuorumVotes(
      20,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
  assert.bigIntEquals(
    BigInt.fromI32(46),
    dynamicQuorumVotes(
      30,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
  assert.bigIntEquals(
    BigInt.fromI32(74),
    dynamicQuorumVotes(
      40,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
  assert.bigIntEquals(
    BigInt.fromI32(80),
    dynamicQuorumVotes(
      50,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
  assert.bigIntEquals(
    BigInt.fromI32(80),
    dynamicQuorumVotes(
      80,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
});

test('dynamicQuorumVotes: capped at max', () => {
  const linearCoefficient = BigInt.fromI32(300000);
  const quadraticCoefficient = BigInt.fromI32(1000);

  assert.bigIntEquals(
    BigInt.fromI32(80),
    dynamicQuorumVotes(
      50,
      BigInt.fromI32(200),
      1000,
      4000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );

  assert.bigIntEquals(
    BigInt.fromI32(112),
    dynamicQuorumVotes(
      50,
      BigInt.fromI32(200),
      1000,
      10000,
      500,
      linearCoefficient,
      quadraticCoefficient,
    ),
  );
});
