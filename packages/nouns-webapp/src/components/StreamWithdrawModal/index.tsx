import React, { useState } from 'react';
import classes from './StreamWidthdrawModal.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Trans } from '@lingui/macro';
import ModalTitle from '../ModalTitle';
import config from '../../config';
import { contract2humanUSDCFormat, human2ContractUSDCFormat } from '../../utils/usdcUtils';
import { BigNumber, ethers, utils } from 'ethers';
import { useEthers } from '@usedapp/core/dist/cjs/src';
import {
  useStreamRatePerSecond,
  useStreamRemaningBalance,
  useWithdrawTokens,
} from '../../wrappers/nounsStream';
import ModalBottomButtonRow from '../ModalBottomButtonRow';
import BrandSpinner from '../BrandSpinner';
import BrandNumericEntry from '../BrandNumericEntry';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import StartOrEndTime from '../StartOrEndTime';

dayjs.extend(relativeTime);

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const StreamWidthdrawModalOverlay: React.FC<{
  onDismiss: () => void;
  streamAddress?: string;
  endTime?: number;
  startTime?: number;
  streamAmount?: number;
  tokenAddress?: string;
}> = props => {
  const {
    onDismiss,
    streamAddress = '',
    streamAmount = '',
    endTime = 0,
    startTime = 0,
    tokenAddress = '',
  } = props;

  const isUSDC = tokenAddress.toLowerCase() === config.addresses.usdcToken?.toLowerCase();
  const unitForDisplay = isUSDC ? 'USDC' : 'WETH';
  const { account } = useEthers();
  // TODO chance name to available to withdraw or something to that effect
  const streamRemaningBalance = useStreamRemaningBalance(streamAddress ?? '', account ?? '');
  const { widthdrawTokens, widthdrawTokensState } = useWithdrawTokens(streamAddress ?? '');
  const [widthdrawAmount, setWidthdrawAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const streamRatePerSecond = useStreamRatePerSecond(streamAddress ?? '') ?? 0;
  const streamedSoFar =
    streamRatePerSecond && Math.floor(Date.now() / 1000) - startTime > 0
      ? streamRatePerSecond.mul(BigNumber.from(Math.floor(Date.now() / 1000) - startTime))
      : 0;

  if (!streamRemaningBalance || isLoading) {
    return (
      <>
        <ModalTitle>
          <Trans>Withdraw from Stream</Trans>
        </ModalTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {(widthdrawTokensState.status === 'Mining' ||
            !streamRemaningBalance ||
            widthdrawTokensState.status === 'PendingSignature') && <BrandSpinner />}
          {widthdrawTokensState.status === 'Success' && (
            <div className={classes.transactionStatus}>
              <p>
                <Trans>
                  You've successfully withrawn{' '}
                  {isUSDC
                    ? contract2humanUSDCFormat(widthdrawAmount.toString())
                    : ethers.utils.formatUnits(widthdrawAmount.toString()).toString()}{' '}
                  {unitForDisplay} to your wallet
                </Trans>
              </p>
            </div>
          )}
          {(widthdrawTokensState.status === 'Exception' ||
            widthdrawTokensState.status === 'Fail') && (
            <div className={classes.transactionStatus}>
              <p className={classes.voteFailureTitle}>
                <Trans>There was an error withdrawing to your wallet.</Trans>
              </p>
              <div className={classes.voteFailureBody}>
                Error:{' '}
                <span className={classes.voteFailureErrorMessage}>
                  {widthdrawTokensState.errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ModalTitle>
        <Trans>Withdraw from Stream</Trans>
      </ModalTitle>

      <span
        style={{
          opacity: '0.5',
          fontWeight: 'bold',
        }}
      >
        Avilable to withdraw
      </span>
      <h1
        style={{
          fontWeight: 'bold',
        }}
      >
        {isUSDC
          ? contract2humanUSDCFormat(streamRemaningBalance?.toString() ?? '')
          : ethers.utils.formatUnits(streamRemaningBalance?.toString() ?? '').toString()}{' '}
        {unitForDisplay}
      </h1>

      <span
        style={{
          opacity: '0.5',
          fontWeight: 'bold',
        }}
      >
        Streamed so far
      </span>
      <h1
        style={{
          fontWeight: 'bold',
        }}
      >
        {isUSDC
          ? contract2humanUSDCFormat(streamedSoFar?.toString() ?? '')
          : ethers.utils.formatUnits(streamedSoFar?.toString() ?? '').toString()}{' '}
        {unitForDisplay}
      </h1>

      <span
        style={{
          opacity: '0.5',
          fontWeight: 'bold',
        }}
      >
        Total stream value
      </span>
      <h1
        style={{
          fontWeight: 'bold',
        }}
      >
        {isUSDC
          ? contract2humanUSDCFormat(streamAmount)
          : ethers.utils.formatUnits(streamAmount.toString()).toString()}{' '}
        {unitForDisplay}
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <BrandNumericEntry
          label={'Widthdraw amount'}
          value={widthdrawAmount}
          onValueChange={e => {
            setWidthdrawAmount(parseInt(e.value));
          }}
          placeholder={isUSDC ? '0 USDC' : '0 WETH'}
          isInvalid={widthdrawAmount > streamRemaningBalance.toNumber()}
        />
        {/* Hover brightness */}
        <div
          style={{
            position: 'absolute',
            right: '40px',
            top: '68%',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() =>
            setWidthdrawAmount(
              parseFloat(
                isUSDC
                  ? contract2humanUSDCFormat(streamRemaningBalance?.toString() ?? '')
                  : ethers.utils.formatUnits(streamRemaningBalance?.toString() ?? '').toString(),
              ),
            )
          }
        >
          Max
        </div>
      </div>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Cancel</Trans>}
        onPrevBtnClick={onDismiss}
        nextBtnText={<Trans>Widthdraw</Trans>}
        onNextBtnClick={async () => {
          setIsLoading(true);
          widthdrawTokens(
            isUSDC
              ? human2ContractUSDCFormat(widthdrawAmount.toString())
              : utils.parseEther(widthdrawAmount.toString()).toString(),
          );
        }}
        isNextBtnDisabled={streamRemaningBalance && streamRemaningBalance.toNumber() === 0}
      />
      <div
        style={{
          opacity: '0.5',
          fontWeight: 'bold',
          marginBottom: '1rem',
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Stream <StartOrEndTime startTime={startTime} endTime={endTime} />
      </div>
    </>
  );
};

const StreamWidthdrawModal: React.FC<{
  show: boolean;
  onDismiss: () => void;
  streamAddress?: string;
  startTime?: number;
  endTime?: number;
  streamAmount?: number;
  tokenAddress?: string;
}> = props => {
  const { onDismiss, show } = props;
  return (
    <>
      <SolidColorBackgroundModal
        show={show}
        onDismiss={onDismiss}
        content={<StreamWidthdrawModalOverlay {...props} />}
      />
    </>
  );
};

export default StreamWidthdrawModal;
