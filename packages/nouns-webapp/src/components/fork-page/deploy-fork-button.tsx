import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { Spinner } from 'react-bootstrap';
import { isNullish } from 'remeda';

import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Hash } from '@/utils/types';
import { useExecuteFork } from '@/wrappers/nouns-dao';


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
    <div className="text-center">
      <h2>
        <Trans>Deploy Fork</Trans>
      </h2>
      <p>
        <Trans>Deploying Nouns fork and beginning the forking period</Trans>
      </p>
      <p
        className={cn(
          'font-pt mb-4 rounded-[8px] border border-[#e6e6e6] bg-white p-4 text-center text-[15px] font-bold',
          isTxSuccessful &&
            'border-[var(--brand-color-green)] bg-[var(--brand-color-green-translucent)] text-[var(--brand-color-green)]',
          hasErrorMessage &&
            'border-[var(--brand-color-red-translucent)] bg-[var(--brand-color-red-translucent)] text-[var(--brand-color-red)]',
        )}
      >
        {isWaiting && (
          <>
            <img
              src="/loading-noggles.svg"
              alt="loading"
              className="mx-auto mb-2 block max-w-[75px]"
            />
            Awaiting confirmation
          </>
        )}
        {isLoading && (
          <>
            <img
              src="/loading-noggles.svg"
              alt="loading"
              className="mx-auto mb-2 block max-w-[75px]"
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
          className={cn(
            'font-pt h-fit rounded-[8px] px-[16px] py-[10px] font-bold leading-none transition-all duration-150 ease-in-out',
            'bg-black text-white no-underline hover:opacity-75 disabled:opacity-50',
            'w-full border-2 border-[var(--brand-color-red)] bg-[var(--brand-color-red)] text-white',
          )}
          onClick={async () => {
            props.setIsDeployModalOpen(true);
            await executeFork({});
          }}
          disabled={!props.isUserConnected || isLoading || isWaiting}
        >
          {isLoading || isWaiting ? (
            <div className="text-[var(--brand-gray-light-text)]">
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
