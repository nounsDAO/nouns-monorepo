import { ReactNode, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx';
import classes from './Fork.module.css';
import { useExecuteFork } from '../../wrappers/nounsDao'
import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import SolidColorBackgroundModal from '../../components/SolidColorBackgroundModal';
import { buildEtherscanTxLink } from '../../utils/etherscan';

type Props = {
  isWithdrawModalOpen: Function;
  setDataFetchPollInterval: Function;
}

function DeployForkButton(props: Props) {
  const { executeFork, executeForkState } = useExecuteFork();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);

  const handleExecuteForkStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'PendingSignature':
        setIsWaiting(true);
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
        setErrorMessage(<>{state?.errorMessage}<br /><Trans>Please try again.</Trans></> || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'Exception':
        setIsError(true);
        setErrorMessage(<>{state?.errorMessage}<br /><Trans>Please try again.</Trans></> || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        setIsWaiting(false);
        break;
    }
  }, []);

  useEffect(() => {
    handleExecuteForkStateChange(executeForkState);
  }, [executeForkState, handleExecuteForkStateChange]);

  const modalContent = (
    <div className={classes.transactionModal}>
      <h2 className={classes.transactionModalTitle}>
        <Trans>Deploy Fork</Trans>
      </h2>
      <p><Trans>Deploying a Nouns fork and beginning the forking period</Trans></p>
      <p className={clsx(
        classes.transactionStatus,
        isLoading && classes.transactionStatusLoading,
        isTxSuccessful && classes.transactionStatusSuccess,
        isError && classes.transactionStatusError,
      )}>
        {isWaiting && <><img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />Awaiting confirmation</>}
        {isLoading && <><img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />Deploying</>}
        {isTxSuccessful && <>
          <Trans>Success! The fork has been deployed.</Trans>
          {executeForkState.transaction && <a href={`${buildEtherscanTxLink(executeForkState.transaction.hash)}`} target="_blank" rel="noreferrer"><Trans>View on Etherscan</Trans></a>}
        </>}
        {isError && errorMessage}
      </p>
    </div>
  );

  return (
    <>
      <button
        className={clsx(classes.button, classes.primaryButton, classes.deployButton)}
        onClick={() => {
          setIsModalOpen(true);
          executeFork();
        }
        }
      >
        <Trans>Deploy Nouns fork</Trans>
      </button>
      <SolidColorBackgroundModal
        show={isModalOpen}
        onDismiss={() => {
          setIsModalOpen(false);
          setIsLoading(false);
          setIsWaiting(false);
          setIsTxSuccessful(false);
          setIsError(false);
          setErrorMessage('');
          props.isWithdrawModalOpen(false);
          props.setDataFetchPollInterval(0);
        }}
        content={modalContent}
      />
    </>
  )
}

export default DeployForkButton