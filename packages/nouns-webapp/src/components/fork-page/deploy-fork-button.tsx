import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { Spinner } from 'react-bootstrap';
import { isNullish } from 'remeda';

import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Hash } from '@/utils/types';
import { useExecuteFork } from '@/wrappers/nouns-dao';

import classes from './fork.module.css';

type Props = {
  isDeployModalOpen: boolean;
  isForkPeriodActive: boolean;
  isThresholdMet: boolean;
  isUserConnected: boolean;
  setDataFetchPollInterval: (ms: number) => void;
  refetchData: () => void | Promise<void>;
  setIsDeployModalOpen: (open: boolean) => void;
};

function DeployForkButton(props: Props) {
  const { executeFork, executeForkState } = useExecuteFork();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);

  const hasErrorMessage = !isNullish(errorMessage) && errorMessage !== '';

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
            errorMessage ? (
              <>
                {errorMessage}
                <br />
                <Trans>Please try again.</Trans>
              </>
            ) : (
              <Trans>Please try again.</Trans>
            ),
          );
          setIsLoading(false);
          setIsWaiting(false);
          break;
        case 'Exception':
          setErrorMessage(
            errorMessage ? (
              <>
                {errorMessage}
                <br />
                <Trans>Please try again.</Trans>
              </>
            ) : (
              <Trans>Please try again.</Trans>
            ),
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
        className={cn(
          classes.transactionStatus,
          isLoading ? classes.transactionStatusLoading : undefined,
          isTxSuccessful ? classes.transactionStatusSuccess : undefined,
          hasErrorMessage ? classes.transactionStatusError : undefined,
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
            {!isNullish(executeForkState.transaction) ? (
              <a
                href={`${buildEtherscanTxLink(executeForkState.transaction.hash as Hash)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Trans>View on Etherscan</Trans>
              </a>
            ) : null}
          </>
        )}
        {hasErrorMessage ? errorMessage : null}
      </p>
    </div>
  );

  return (
    <>
      {!props.isForkPeriodActive && props.isThresholdMet && (
        <button
          type="button"
          className={cn(classes.button, classes.primaryButton, classes.deployButton)}
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
