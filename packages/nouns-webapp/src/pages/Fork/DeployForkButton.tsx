import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

import SolidColorBackgroundModal from '@/components/SolidColorBackgroundModal';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Hash } from '@/utils/types';
import { useExecuteFork } from '@/wrappers/nounsDao';

import classes from './Fork.module.css';

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

  const handleExecuteForkStateChange = useCallback(
    ({ errorMessage, status }: { status: string; errorMessage?: string }) => {
      switch (status) {
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
                {errorMessage}
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
                {errorMessage}
                <br />
                <Trans>Please try again.</Trans>
              </>
            ) || <Trans>Please try again.</Trans>,
          );
          setIsLoading(false);
          setIsWaiting(false);
          break;
      }
    },
    [props],
  );

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
                href={`${buildEtherscanTxLink(executeForkState.transaction.hash as Hash)}`}
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
          onClick={async () => {
            props.setIsDeployModalOpen(true);
            await executeFork({});
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
