import { encodeAbiParameters, getAbiItem } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProposalActionModalState, ProposalActionType } from '@/components/proposal-actions-modal';
import { handleActionAdd } from '@/components/proposal-actions-modal/steps/function-call-review-step';

const ensReverseRegistrarAbi = [
  {
    inputs: [{ internalType: 'contract ENS', name: 'ensAddr', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'controller', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'ControllerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract NameResolver', name: 'resolver', type: 'address' },
    ],
    name: 'DefaultResolverChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'node', type: 'bytes32' },
    ],
    name: 'ReverseClaimed',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'claim',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'resolver', type: 'address' },
    ],
    name: 'claimForAddr',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'resolver', type: 'address' },
    ],
    name: 'claimWithResolver',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'controllers',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultResolver',
    outputs: [{ internalType: 'contract NameResolver', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ens',
    outputs: [{ internalType: 'contract ENS', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'node',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'controller', type: 'address' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'setController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'resolver', type: 'address' }],
    name: 'setDefaultResolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
    name: 'setName',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'string', name: 'name', type: 'string' },
    ],
    name: 'setNameForAddr',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

describe('handleActionAdd', () => {
  const mockOnActionAdd = vi.fn();

  beforeEach(() => {
    mockOnActionAdd.mockClear();
  });

  it('should call onActionAdd with signature and encoded calldata when state.function is provided', () => {
    const state: ProposalActionModalState = {
      actionType: ProposalActionType.FUNCTION_CALL,
      address: '0xa58e81fe9b61b5c3fe2afd33cf304c454abfc7cb',
      abi: ensReverseRegistrarAbi,
      function: 'setName',
      amount: '0',
      args: ['nouns.eth'],
    };

    const setNameFunction = getAbiItem({ abi: ensReverseRegistrarAbi, name: 'setName' });
    const expectedCalldata = encodeAbiParameters(setNameFunction.inputs, ['nouns.eth']);

    handleActionAdd(state, mockOnActionAdd);

    expect(mockOnActionAdd).toHaveBeenCalledOnce();
    expect(mockOnActionAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        address: state.address,
        signature: 'setName(string)',
        calldata: expectedCalldata,
        decodedCalldata: JSON.stringify(state.args ?? []),
        value: 0n,
      }),
    );
  });

  it('should call onActionAdd without signature when state.function is not provided', () => {
    const state: ProposalActionModalState = {
      actionType: ProposalActionType.LUMP_SUM,
      address: '0x6a024f521f83906671e1a23a8B6c560be7e980F4',
      amount: '1',
    };

    handleActionAdd(state, mockOnActionAdd);

    expect(mockOnActionAdd).toHaveBeenCalledOnce();
    expect(mockOnActionAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        calldata: '0x',
        address: state.address,
        signature: '',
        value: 1000000000000000000n,
        decodedCalldata: '[]',
      }),
    );
  });
});
