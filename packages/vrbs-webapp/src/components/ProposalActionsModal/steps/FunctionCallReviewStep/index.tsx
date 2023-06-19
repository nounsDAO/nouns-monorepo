import { Trans } from '@lingui/macro';
import { utils } from 'ethers/lib/ethers';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import { buildEtherscanAddressLink } from '../../../../utils/etherscan';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import ShortAddress from '../../../ShortAddress';
import classes from './FunctionCallReviewStep.module.css';

export enum SupportedCurrencies {
  ETH = 'ETH',
  USDC = 'USDC',
}

const handleActionAdd = (state: ProposalActionModalState, onActionAdd: (e?: any) => void) => {
  onActionAdd({
    address: state.address,
    value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
    signature: state.function,
    decodedCalldata: JSON.stringify(state.args ?? []),
    calldata: state.abi?._encodeParams(
      state.abi?.functions[state.function ?? '']?.inputs ?? [],
      state.args ?? [],
    ),
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
          {state.abi?.functions[state.function ?? '']?.inputs?.length ? '' : <Trans>None</Trans>}
        </Col>
      </Row>
      {state.abi?.functions[state.function ?? '']?.inputs.map((input, i) => (
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
