import { ReactNode, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import classes from './Fork.module.css';
import { useExecuteFork } from '../../wrappers/nounsDao';
import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import SolidColorBackgroundModal from '../../components/SolidColorBackgroundModal';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import { Spinner } from 'react-bootstrap';

type Props = {
  isDeployModalOpen: boolean;
  isForkPeriodActive: boolean;
  isThresholdMet: boolean;
  isUserConnected: boolean;
  setDataFetchPollInterval: Function;
  refetchData: Function;
  setIsDeployModalOpen: Function;
};

function DeployForkButton(props: Props) {
  const { executeFork, executeForkState } = useExecuteFork();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);

  const handleExecuteForkStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'PendingSignature':
        setIsWaiting(true);
        setErrorMessage('');
        break;
      case 'Mining':
        setIsLoading(true);
        setIsWaiting(false);
        props.setDataFetchPollInterval(50);
        break;
      case 'Success':
        setIsLoading(false);
        setIsTxSuccessful(true);
        props.refetchData();
        break;
      case 'Fail':
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleExecuteForkStateChange(executeForkState);
  }, [executeForkState, handleExecuteForkStateChange]);

  const modalContent = (
    <div className={classes.transactionModal}>
      <h2 className={classes.transactionModalTitle}>
        <Trans>Deploy Fork</Trans>
      </h2>
      <p>
        <Trans>Deploying Nouns fork and beginning the forking period</Trans>
      </p>
      <p
        className={clsx(
          classes.transactionStatus,
          isLoading && classes.transactionStatusLoading,
          isTxSuccessful && classes.transactionStatusSuccess,
          errorMessage && classes.transactionStatusError,
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
            Deploying
          </>
        )}
        {isTxSuccessful && (
          <>
            <Trans>Success! The fork has been deployed.</Trans>
            <br />
            {executeForkState.transaction && (
              <a
                href={`${buildEtherscanTxLink(executeForkState.transaction.hash)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Trans>View on Etherscan</Trans>
              </a>
            )}
          </>
        )}
        {errorMessage && errorMessage}
      </p>
    </div>
  );

  return (
    <>
      {!props.isForkPeriodActive && props.isThresholdMet && (
        <button
          className={clsx(classes.button, classes.primaryButton, classes.deployButton)}
          onClick={() => {
            props.setIsDeployModalOpen(true);
            executeFork();
          }}
          disabled={!props.isUserConnected || isLoading || isWaiting}
        >
          {isLoading || isWaiting ? (
            <div className={classes.spinner}>
              <Spinner animation="border" />
            </div>
          ) : (
            <Trans>Deploy Nouns fork</Trans>
          )}
        </button>
      )}
      <SolidColorBackgroundModal
        show={props.isDeployModalOpen}
        onDismiss={() => {
          setIsTxSuccessful(false);
          setErrorMessage('');
          props.setIsDeployModalOpen(false);
          props.setDataFetchPollInterval(0);
        }}
        content={modalContent}
      />
    </>
  );
}

export default DeployForkButton;
