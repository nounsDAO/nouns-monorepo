import { assert, clearStore, test, describe, afterEach } from 'matchstick-as/assembly/index';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { BIGINT_10K, BIGINT_ONE } from '../src/utils/constants';
import { calcEncodedProposalHash, getOrCreateDynamicQuorumParams } from '../src/utils/helpers';
import { Proposal } from '../src/types/schema';

describe('getOrCreateDynamicQuorumParams', () => {
  afterEach(() => {
    clearStore();
  });

  test('sets dynamicQuorumStartBlock to null', () => {
    const params = getOrCreateDynamicQuorumParams();

    assert.assertTrue(params.dynamicQuorumStartBlock === null);
  });

  test('sets dynamicQuorumStartBlock to input block number', () => {
    const params = getOrCreateDynamicQuorumParams(BIGINT_10K);

    assert.bigIntEquals(BIGINT_10K, params.dynamicQuorumStartBlock as BigInt);
  });

  test('sets dynamicQuorumStartBlock first number after first being null, and later attempt to set to a different number', () => {
    let params = getOrCreateDynamicQuorumParams();
    assert.assertTrue(params.dynamicQuorumStartBlock === null);

    params = getOrCreateDynamicQuorumParams(BIGINT_ONE);
    assert.bigIntEquals(BIGINT_ONE, params.dynamicQuorumStartBlock as BigInt);

    params = getOrCreateDynamicQuorumParams(BIGINT_10K);
    assert.bigIntEquals(BIGINT_ONE, params.dynamicQuorumStartBlock as BigInt);
  });

  test('calcEncodedProposalHash', () => {
    const proposal = new Proposal('1');
    proposal.description = 'some description';
    proposal.proposer = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';
    proposal.targets = [Bytes.fromHexString('0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa')];
    proposal.values = [BigInt.fromU32(300)];
    proposal.signatures = ['some signature'];
    proposal.calldatas = [Bytes.fromUTF8('some data')];

    const hash = calcEncodedProposalHash(proposal, false);
    assert.bytesEquals(
      Bytes.fromHexString('0xcf95b7d08d761ff0bf1223220f45b79baffbce6c8bcceb8df5399cbc6d22c40d'),
      hash,
    );

    proposal.targets = [
      Bytes.fromHexString('0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'),
      Bytes.fromHexString('0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'),
    ];
    proposal.values = [BigInt.fromU32(300), BigInt.fromU32(500)];
    proposal.signatures = ['some signature', 'hello()'];
    proposal.calldatas = [Bytes.fromUTF8('some data'), Bytes.fromHexString('0xaabbccdd')];

    const hash2 = calcEncodedProposalHash(proposal, false);
    assert.bytesEquals(
      Bytes.fromHexString('0x5d6f3b870407fff8109c6c9469173eef879d0d2eaf3de0fb5770b7f48f760101'),
      hash2,
    );

    const hash3 = calcEncodedProposalHash(proposal, true);
    assert.bytesEquals(
      Bytes.fromHexString('0xdc10157349778884412d140419c22ab67aa7a84a4f23dead50533a9aca0fbb28'),
      hash3,
    );
  });
});
