import type { Address } from '@/utils/types';

import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatUnits } from 'viem';

import BrandNumericEntry from '@/components/brand-numeric-entry';
import BrandSpinner from '@/components/brand-spinner';
import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalLabel from '@/components/modal-label';
import ModalTitle from '@/components/modal-title';
import { SupportedCurrency } from '@/components/proposal-actions-modal/steps/transfer-funds-details-step';
import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import StartOrEndTime from '@/components/start-or-end-time';
import { usdcAddress } from '@/contracts';
import { countDecimals } from '@/utils/number-utils';
import { formatTokenAmount } from '@/utils/streaming-payment-utils/streaming-payment-utils';
import { contract2humanUSDCFormat } from '@/utils/usdc-utils';
import { defaultChain } from '@/wagmi';
import {
  useElapsedTime,
  useStreamRemainingBalance,
  useWithdrawTokens,
} from '@/wrappers/nouns-stream';

// Inlined former CSS module styles with Tailwind

dayjs.extend(relativeTime);

interface StreamWithdrawModalOverlayProps {
  onDismiss: () => void;
  streamAddress: Address;
  endTime?: number;
  startTime?: number;
  streamAmount?: number;
  tokenAddress: Address;
}

const StreamWithdrawModalOverlay: React.FC<StreamWithdrawModalOverlayProps> = props => {
  const {
    onDismiss,
    streamAddress,
    streamAmount = 0,
    endTime = 0,
    startTime = 0,
    tokenAddress = '',
  } = props;

  const chainId = defaultChain.id;

  const isUSDC = tokenAddress.toLowerCase() === usdcAddress[chainId].toLowerCase();
  const unitForDisplay = isUSDC ? 'USDC' : 'WETH';

  const withdrawableBalance = useStreamRemainingBalance(streamAddress) ?? 0n;
  const { withdrawTokens, withdrawTokensState } = useWithdrawTokens(streamAddress);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const elapsedTime = useElapsedTime(streamAddress);

  const [percentStreamedSoFar, setPercentStreamedSoFar] = useState(0);

  useEffect(() => {
    if (elapsedTime) {
      setPercentStreamedSoFar(
        100.0 * Math.max(0, Math.min(1, Number(elapsedTime) / (endTime - startTime))),
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
        <div className="flex justify-center">
          {(withdrawTokensState.status === 'Mining' ||
            !withdrawableBalance ||
            withdrawTokensState.status === 'PendingSignature') && <BrandSpinner />}
          {withdrawTokensState.status === 'Success' && (
            <div className="text-[18px] mb-8 text-center font-bold font-pt">
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
            <div className="text-[18px] mb-8 text-center font-bold font-pt">
              <p className="font-normal w-full">
                <Trans>There was an error withdrawing to your wallet.</Trans>
              </p>
              <div className="mt-4 font-bold">
                Error:{' '}
                <span className="font-bold text-[var(--brand-color-red)]">
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
      <h1 className="font-bold">
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
      <h1 className="font-bold">{percentStreamedSoFar.toFixed(numDecimalPlaces)}%</h1>

      <ModalLabel>Total stream value</ModalLabel>

      <h1 className="font-bold">
        {isUSDC
          ? contract2humanUSDCFormat(streamAmount)
          : formatUnits(BigInt(streamAmount.toString()), 18).toString()}{' '}
        {unitForDisplay}
      </h1>

      <div className="flex justify-end">
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
          className="absolute right-10 top-[68%] text-[18px] font-bold cursor-pointer"
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
          withdrawTokens(
            formatTokenAmount(
              Number(withdrawAmount),
              isUSDC ? SupportedCurrency.USDC : SupportedCurrency.WETH,
            ),
          );
        }}
        isNextBtnDisabled={withdrawableBalance !== 0n && humanUnitsStreamRemainingBalance === 0}
      />
      <div className="opacity-50 font-bold mb-4 mt-4 flex justify-center">
        Stream <StartOrEndTime startTime={startTime} endTime={endTime} />
      </div>
    </>
  );
};

interface StreamWithdrawModalProps {
  show: boolean;
  onDismiss: () => void;
  streamAddress: Address;
  endTime?: number;
  startTime?: number;
  streamAmount?: number;
  tokenAddress: Address;
}

const StreamWithdrawModal: React.FC<StreamWithdrawModalProps> = props => {
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
