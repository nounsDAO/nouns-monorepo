import { describe, expect, it } from 'vitest';
import { encodeAbiParameters } from 'viem';
import { concatSelectorToCalldata, formatProposalTransactionDetails } from './nounsDao';

const target = '0x0000000000000000000000000000000000000001' as const;
const format = (signature: string, calldata: `0x${string}`, value = 0n) =>
  formatProposalTransactionDetails({
    targets: [target],
    signatures: [signature],
    calldatas: [calldata],
    values: [value],
  })[0];

describe('proposal transaction parsing', () => {
  it('restores the historical ETH transfer display without raw wei', () => {
    expect(format('', '0x', 100000000000000n)).toEqual({
      target,
      functionSig: 'transfer',
      callData: '0.0001 ETH',
    });
  });
  it('does not invent an ETH argument for a zero-argument function', () => {
    expect(format('execute()', '0x')).toEqual({
      target,
      functionSig: 'execute',
      callData: '',
      value: 0n,
    });
  });
  it('keeps attached ETH separate on a zero-argument payable function', () => {
    expect(format('deposit()', '0x', 10n)).toEqual({
      target,
      functionSig: 'deposit',
      callData: '',
      value: 10n,
    });
  });
  it('falls back to the full raw call when required arguments are missing', () => {
    const signature = 'sendOrRegisterDebt(address,uint256)';
    expect(format(signature, '0x')).toEqual({
      target,
      callData: concatSelectorToCalldata(signature, '0x'),
      value: 0n,
    });
  });
  it('decodes arguments and keeps attached ETH separate', () => {
    expect(
      format('deposit(uint256)', encodeAbiParameters([{ type: 'uint256' }], [42n]), 1n),
    ).toEqual({ target, functionSig: 'deposit', callData: '42', value: 1n });
  });
  it('preserves selector-bearing calldata when the signature is empty', () => {
    expect(format('', '0x12345678').callData).toBe('0x12345678');
  });
  it('retains the full call when argument decoding fails', () => {
    expect(format('deposit(uint256)', '0x12').callData).toBe(
      concatSelectorToCalldata('deposit(uint256)', '0x12'),
    );
  });
});
