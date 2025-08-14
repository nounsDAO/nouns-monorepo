import type { ProposalTransaction } from '@/wrappers/nounsDao';
import type { AbiFunction } from 'viem';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import { Col, Row } from 'react-bootstrap';
import { encodeAbiParameters, getAbiItem, parseEther, toFunctionSignature } from 'viem';

import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import ShortAddress from '@/components/short-address';
import { buildEtherscanAddressLink } from '@/utils/etherscan';

import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';

import classes from './function-call-review-step.module.css';

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

      <div className={classes.row}>
        <div>
          <span className={classes.label}>
            <Trans>Address</Trans>
          </span>
          <div className={classes.value}>
            <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
              <ShortAddress address={address} />
            </a>
          </div>
        </div>
      </div>

      {value ? (
        <div className={classes.row}>
          <div>
            <span className={classes.label}>
              <Trans>Value</Trans>
            </span>
            <div className={classes.value}>{value ? `${value} ETH` : <Trans>None</Trans>}</div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {func && (
        <div className={classes.row}>
          <div>
            <span className={classes.label}>
              <Trans>Function</Trans>
            </span>
            <div className={classes.value}>{func || <Trans>None</Trans>}</div>
          </div>
        </div>
      )}

      <Row>
        <Col sm="3" className={classes.label}>
          <b>
            <Trans>Arguments</Trans>
          </b>
        </Col>
        <Col sm="9">
          <hr />
        </Col>
        <Col sm="9">
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
        </Col>
      </Row>
      {(functionAbiItem?.inputs ?? []).map((input, i) => (
        <Row key={i}>
          <div className={classes.argument}>
            <div className={classes.argValue}>{input.name}</div>
            <div className={classes.argValue}>{args[i]}</div>
          </div>
        </Row>
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
