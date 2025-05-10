import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatUnits } from 'viem';

import BrandNumericEntry from '@/components/BrandNumericEntry';
import BrandSpinner from '@/components/BrandSpinner';
import ModalBottomButtonRow from '@/components/ModalBottomButtonRow';
import ModalLabel from '@/components/ModalLabel';
import ModalTitle from '@/components/ModalTitle';
import { SupportedCurrency } from '@/components/ProposalActionsModal/steps/TransferFundsDetailsStep';
import SolidColorBackgroundModal from '@/components/SolidColorBackgroundModal';
import StartOrEndTime from '@/components/StartOrEndTime';
import config from '@/config';
import { countDecimals } from '@/utils/numberUtils';
import { formatTokenAmount } from '@/utils/streamingPaymentUtils/streamingPaymentUtils';
import { contract2humanUSDCFormat } from '@/utils/usdcUtils';
import {
  useElapsedTime,
  useStreamRemainingBalance,
  useWithdrawTokens,
} from '@/wrappers/nounsStream';

import classes from './StreamWithdrawModal.module.css';

dayjs.extend(relativeTime);

interface StreamWithdrawModalOverlayProps {
  onDismiss: () => void;
  streamAddress?: string;
  endTime?: number;
  startTime?: number;
  streamAmount?: number;
  tokenAddress?: string;
}

const StreamWithdrawModalOverlay: React.FC<StreamWithdrawModalOverlayProps> = props => {
  const {
    onDismiss,
    streamAddress = '',
    streamAmount = 0,
    endTime = 0,
    startTime = 0,
    tokenAddress = '',
  } = props;

  const isUSDC = tokenAddress.toLowerCase() === config.addresses.usdcToken?.toLowerCase();
  const unitForDisplay = isUSDC ? 'USDC' : 'WETH';

  const withdrawableBalance = useStreamRemainingBalance(streamAddress ?? '') ?? 0;
  const { withdrawTokens, withdrawTokensState } = useWithdrawTokens(streamAddress ?? '');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const elapsedTime = useElapsedTime(streamAddress ?? '');

  const [percentStreamedSoFar, setPercentStreamedSoFar] = useState(0);

  useEffect(() => {
    if (elapsedTime) {
      setPercentStreamedSoFar(
        100.0 * Math.max(0, Math.min(1, elapsedTime / (endTime - startTime))),
      );
    }
  }, [elapsedTime, endTime, percentStreamedSoFar, startTime]);

  const totalStreamValueFormatted = parseFloat(
    isUSDC
      ? contract2humanUSDCFormat(withdrawableBalance?.toString() ?? '')
      : formatUnits(BigInt(withdrawableBalance?.toString() ?? ''), 18).toString(),
  );

  const numDecimalPlaces = Math.max(2, countDecimals(totalStreamValueFormatted));

  if (isLoading) {
    return (
      <>
        <ModalTitle>
          <Trans>Withdraw from Stream</Trans>
        </ModalTitle>
        <div className={classes.center}>
          {(withdrawTokensState.status === 'Mining' ||
            !withdrawableBalance ||
            withdrawTokensState.status === 'PendingSignature') && <BrandSpinner />}
          {withdrawTokensState.status === 'Success' && (
            <div className={classes.transactionStatus}>
              <p>
                <Trans>
                  You&apos;ve successfully withdrawn {withdrawAmount} {unitForDisplay} to your
                  wallet
                </Trans>
              </p>
            </div>
          )}
          {(withdrawTokensState.status === 'Exception' ||
            withdrawTokensState.status === 'Fail') && (
            <div className={classes.transactionStatus}>
              <p className={classes.txnFailureTitle}>
                <Trans>There was an error withdrawing to your wallet.</Trans>
              </p>
              <div className={classes.txnFailureBody}>
                Error:{' '}
                <span className={classes.txnFailureErrorMessage}>
                  {withdrawTokensState.errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const humanUnitsStreamRemainingBalance = parseFloat(
    isUSDC
      ? contract2humanUSDCFormat(withdrawableBalance?.toString() ?? '', true)
      : formatUnits(BigInt(withdrawableBalance?.toString() ?? ''), 18).toString(),
  );

  return (
    <>
      <ModalTitle>
        <Trans>Withdraw from Stream</Trans>
      </ModalTitle>

      <ModalLabel>
        <Trans>Available to withdraw</Trans>
      </ModalLabel>
      <h1 className={classes.bold}>
        {isUSDC
          ? parseFloat(contract2humanUSDCFormat(withdrawableBalance?.toString() ?? ''))
          : parseFloat(
              formatUnits(BigInt(withdrawableBalance?.toString() ?? ''), 18).toString(),
            ).toFixed(numDecimalPlaces)}{' '}
        {unitForDisplay}
      </h1>

      <ModalLabel>
        <Trans>Streamed so far</Trans>
      </ModalLabel>
      <h1 className={classes.bold}>{percentStreamedSoFar.toFixed(numDecimalPlaces)}%</h1>

      <ModalLabel>Total stream value</ModalLabel>

      <h1 className={classes.bold}>
        {isUSDC
          ? contract2humanUSDCFormat(streamAmount)
          : formatUnits(BigInt(streamAmount.toString()), 18).toString()}{' '}
        {unitForDisplay}
      </h1>

      <div className={classes.amtEntryWrapper}>
        <BrandNumericEntry
          label={'Withdraw amount'}
          value={withdrawAmount}
          onValueChange={e => {
            setWithdrawAmount(e.floatValue ?? 0);
          }}
          placeholder={isUSDC ? '0 USDC' : '0 WETH'}
          isInvalid={withdrawAmount > humanUnitsStreamRemainingBalance}
        />
        {/* Hover brightness */}
        <div
          className={classes.amtEntryMax}
          onClick={() =>
            setWithdrawAmount(
              parseFloat(
                isUSDC
                  ? contract2humanUSDCFormat(withdrawableBalance?.toString() ?? '', true)
                  : formatUnits(BigInt(withdrawableBalance?.toString() ?? ''), 18).toString(),
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
        nextBtnText={<Trans>Withdraw</Trans>}
        onNextBtnClick={async () => {
          setIsLoading(true);
          await withdrawTokens(
            formatTokenAmount(
              withdrawAmount.toString(),
              isUSDC ? SupportedCurrency.USDC : SupportedCurrency.WETH,
            ),
          );
        }}
        isNextBtnDisabled={withdrawableBalance !== 0 && humanUnitsStreamRemainingBalance === 0}
      />
      <div className={classes.streamTimeWrapper}>
        Stream <StartOrEndTime startTime={startTime} endTime={endTime} />
      </div>
    </>
  );
};

const StreamWithdrawModal: React.FC<{
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
        content={<StreamWithdrawModalOverlay {...props} />}
      />
    </>
  );
};

export default StreamWithdrawModal;
