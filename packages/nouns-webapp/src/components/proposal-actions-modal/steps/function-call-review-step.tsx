import type { ProposalTransaction } from '@/wrappers/nouns-dao';
import type { AbiFunction } from 'viem';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import { encodeAbiParameters, getAbiItem, parseEther, toFunctionSignature } from 'viem';

import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import {
  FinalProposalActionStepProps,
  ProposalActionModalState,
} from '@/components/proposal-actions-modal';
import ShortAddress from '@/components/short-address';
import { buildEtherscanAddressLink } from '@/utils/etherscan';

/**
 * @internal
 */
export const handleActionAdd = (
  state: ProposalActionModalState,
  onActionAdd: (transaction: ProposalTransaction) => void,
) => {
  const functionName = state.function ?? '';
  let calldata: `0x${string}` = '0x';

  const functionAbiItem =
    state.abi && functionName
      ? (getAbiItem({ abi: state.abi, name: functionName }) as AbiFunction)
      : undefined;

  if (functionAbiItem) {
    calldata = encodeAbiParameters(functionAbiItem.inputs, state.args ?? []);
    const signature = toFunctionSignature(functionAbiItem);

    onActionAdd({
      address: state.address,
      value: state.amount ? parseEther(state.amount.toString()) : 0n,
      signature,
      decodedCalldata: JSON.stringify(state.args ?? []),
      calldata,
    });

    return;
  }

  onActionAdd({
    address: state.address,
    value: state.amount ? parseEther(state.amount.toString()) : 0n,
    decodedCalldata: JSON.stringify(state.args ?? []),
    signature: '',
    calldata,
  });
};

const FunctionCallReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const address = state.address;
  const value = state.amount;
  const func = state.function;
  const args = state.args ?? [];

  const functionAbiItem =
    state.abi && state.function
      ? (getAbiItem({ abi: state.abi, name: state.function }) as AbiFunction)
      : undefined;

  return (
    <div>
      <ModalTitle>
        <Trans>Review Function Call Action</Trans>
      </ModalTitle>

      <div className="flex">
        <div>
          <span className="opacity-50">
            <Trans>Address</Trans>
          </span>
          <div className="text-brand-cool-dark-text mb-2 break-all text-[22px] font-bold">
            <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
              <ShortAddress address={address} />
            </a>
          </div>
        </div>
      </div>

      {value ? (
        <div className="flex">
          <div>
            <span className="opacity-50">
              <Trans>Value</Trans>
            </span>
            <div className="text-brand-cool-dark-text mb-2 break-all text-[22px] font-bold">
              {value ? `${value} ETH` : <Trans>None</Trans>}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {func && (
        <div className="flex">
          <div>
            <span className="opacity-50">
              <Trans>Function</Trans>
            </span>
            <div className="text-brand-cool-dark-text mb-2 break-all text-[22px] font-bold">
              {func || <Trans>None</Trans>}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-3">
        <div className={'col-span-12 opacity-50 sm:col-span-3'}>
          <b>
            <Trans>Arguments</Trans>
          </b>
        </div>
        <div className="col-span-12 sm:col-span-9">
          <hr />
        </div>
        <div className="col-span-12 sm:col-span-9">
          {(() => {
            if (!state.abi || !state.function) {
              return <Trans>None</Trans>;
            }

            const functionInputs = (
              getAbiItem({ abi: state.abi, name: state.function }) as AbiFunction
            )?.inputs;

            if (!functionInputs?.length) {
              return <Trans>None</Trans>;
            }

            return <></>;
          })()}
        </div>
      </div>
      {(functionAbiItem?.inputs ?? []).map((input, i) => (
        <div className="grid grid-cols-12 gap-3" key={i}>
          <div className="mb-1 flex justify-between">
            <div className="max-w-[50%] break-all">{input.name}</div>
            <div className="max-w-[50%] break-all">{args[i]}</div>
          </div>
        </div>
      ))}

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Action</Trans>}
        onNextBtnClick={() => {
          handleActionAdd(state, onNextBtnClick);
          onDismiss();
        }}
      />
    </div>
  );
};

export default FunctionCallReviewStep;
