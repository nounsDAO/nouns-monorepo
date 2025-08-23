import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { map, isNullish } from 'remeda';

import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { useWithdrawFromForkEscrow } from '@/wrappers/nouns-dao';

import classes from './fork.module.css';

type Props = {
  tokenIds: number[];
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (isOpen: boolean) => void;
  setDataFetchPollInterval: (interval: number) => void;
};

function WithdrawNounsButton(props: Props) {
  const { withdrawFromForkEscrow, withdrawFromForkEscrowState } = useWithdrawFromForkEscrow();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const handleWithdrawFromForkEscrowStateChange = useCallback(
    ({ errorMessage, status }: { status: string; errorMessage?: string }) => {
      switch (status) {
        case 'None':
          setIsLoading(false);
          break;
        case 'Mining':
          setIsLoading(true);
          setIsWaiting(false);
          break;
        case 'Success':
          setIsLoading(false);
          setIsWaiting(false);
          setIsTxSuccessful(true);
          break;
        case 'Fail':
          setIsError(true);
          {
            const hasErr = !isNullish(errorMessage) && errorMessage !== '';
            setErrorMessage(
              hasErr ? (
                <>
                  {errorMessage}
                  <br />
                  <Trans>Please try again.</Trans>
                </>
              ) : (
                <Trans>Please try again.</Trans>
              ),
            );
          }
          setIsLoading(false);
          setIsWaiting(false);
          break;
        case 'Exception':
          setIsError(true);
          {
            const hasErr = !isNullish(errorMessage) && errorMessage !== '';
            setErrorMessage(
              hasErr ? (
                <>
                  {errorMessage}
                  <br />
                  <Trans>Please try again.</Trans>
                </>
              ) : (
                <Trans>Please try again.</Trans>
              ),
            );
          }
          setIsLoading(false);
          setIsWaiting(false);
          break;
      }
    },
    [],
  );

  useEffect(() => {
    handleWithdrawFromForkEscrowStateChange(withdrawFromForkEscrowState);
  }, [withdrawFromForkEscrowState, handleWithdrawFromForkEscrowStateChange]);

  const modalContent = (
    <div className={classes.transactionModal}>
      <h2 className={classes.transactionModalTitle}>
        <Trans>Withdraw Nouns from escrow</Trans>
      </h2>
      <p>Withdrawing {props.tokenIds.map(nounId => `Noun ${nounId}`).join(', ')}</p>
      <p
        className={cn(
          classes.transactionStatus,
          classes.withdrawStatus,
          isLoading && classes.transactionStatusLoading,
          isTxSuccessful && classes.transactionStatusSuccess,
          isError && classes.transactionStatusError,
        )}
      >
        {isWaiting && (
          <>
            <img
              src="/loading-noggles.svg"
              alt="loading"
              className={classes.transactionModalSpinner}
            />
            Awaiting confirmation
          </>
        )}
        {isLoading && (
          <>
            <img
              src="/loading-noggles.svg"
              alt="loading"
              className={classes.transactionModalSpinner}
            />
            Withdrawing
          </>
        )}
        {isTxSuccessful && (
          <>
            Success! Your Nouns have been withdrawn.
            {withdrawFromForkEscrowState.transaction.hash && (
              <a
                href={`${buildEtherscanTxLink(withdrawFromForkEscrowState.transaction.hash)}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Etherscan
              </a>
            )}
          </>
        )}
        {isError && errorMessage}
      </p>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={cn(classes.button, classes.secondaryButton, classes.withdrawButton)}
        onClick={async () => {
          await withdrawFromForkEscrow({
            args: [map(props.tokenIds, n => BigInt(n))],
          });
          // setIsModalOpen(true);
          setIsWaiting(true);
          props.setIsWithdrawModalOpen(true);
        }}
        disabled={isLoading || isWaiting}
      >
        <Trans>Withdraw Nouns from escrow</Trans>
      </button>
      <SolidColorBackgroundModal
        show={props.isWithdrawModalOpen}
        onDismiss={() => {
          setIsLoading(false);
          setIsWaiting(false);
          setIsTxSuccessful(false);
          setIsError(false);
          setErrorMessage('');
          props.setIsWithdrawModalOpen(false);
          props.setDataFetchPollInterval(0);
        }}
        content={modalContent}
      />
    </>
  );
}

export default WithdrawNounsButton;
