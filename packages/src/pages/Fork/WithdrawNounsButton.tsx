import { ReactNode, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import classes from './Fork.module.css';
import { useWithdrawFromForkEscrow } from '../../wrappers/nounsDao';
import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import SolidColorBackgroundModal from '../../components/SolidColorBackgroundModal';
import { buildEtherscanTxLink } from '../../utils/etherscan';

type Props = {
  tokenIds: number[];
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: Function;
  setDataFetchPollInterval: Function;
};

function WithdrawNounsButton(props: Props) {
  const { withdrawFromForkEscrow, withdrawFromForkEscrowState } = useWithdrawFromForkEscrow();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const handleWithdrawFromForkEscrowStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
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
        setErrorMessage(
          (
            <>
              {state?.errorMessage}
              <br />
              <Trans>Please try again.</Trans>
            </>
          ) || <Trans>Please try again.</Trans>,
        );
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'Exception':
        setIsError(true);
        setErrorMessage(
          (
            <>
              {state?.errorMessage}
              <br />
              <Trans>Please try again.</Trans>
            </>
          ) || <Trans>Please try again.</Trans>,
        );
        setIsLoading(false);
        setIsWaiting(false);
        break;
    }
  }, []);

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
        className={clsx(
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
            {withdrawFromForkEscrowState.transaction && (
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
        className={clsx(classes.button, classes.secondaryButton, classes.withdrawButton)}
        onClick={() => {
          withdrawFromForkEscrow(props.tokenIds);
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
