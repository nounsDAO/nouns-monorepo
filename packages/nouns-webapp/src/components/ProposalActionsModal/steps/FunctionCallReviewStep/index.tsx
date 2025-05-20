import type { AbiFunction } from 'viem';
import { encodeFunctionData, getAbiItem, parseEther } from 'viem';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import { Col, Row } from 'react-bootstrap';

import ModalBottomButtonRow from '@/components/ModalBottomButtonRow';
import ModalTitle from '@/components/ModalTitle';
import ShortAddress from '@/components/ShortAddress';
import { buildEtherscanAddressLink } from '@/utils/etherscan';

import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';

import classes from './FunctionCallReviewStep.module.css';

const handleActionAdd = (state: ProposalActionModalState, onActionAdd: (e?: any) => void) => {
  const functionName = state.function ?? '';
  let calldata = '0x';

  if (state.abi && functionName) {
    try {
      const abiItem = getAbiItem({ abi: state.abi, name: functionName }) as AbiFunction;
      calldata = encodeFunctionData({
        abi: [abiItem],
        functionName,
        args: state.args ?? [],
      });
    } catch (error) {
      console.error('Error encoding function data:', error);
    }
  }

  onActionAdd({
    address: state.address,
    value: state.amount ? parseEther(state.amount.toString()).toString() : '0',
    signature: functionName,
    decodedCalldata: JSON.stringify(state.args ?? []),
    calldata,
  });
};

const FunctionCallReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  const address = state.address;
  const value = state.amount;
  const func = state.function;
  const args = state.args ?? [];

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
      {state.abi &&
        state.function &&
        ((getAbiItem({ abi: state.abi, name: state.function }) as AbiFunction)?.inputs || []).map(
          (input, i) => (
            <Row key={i}>
              <div className={classes.argument}>
                <div className={classes.argValue}>{input.name}</div>
                <div className={classes.argValue}>{args[i]}</div>
              </div>
            </Row>
          ),
        )}

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
