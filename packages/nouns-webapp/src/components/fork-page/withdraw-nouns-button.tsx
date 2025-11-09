import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { map, isNullish } from 'remeda';

import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { useWithdrawFromForkEscrow } from '@/wrappers/nouns-dao';

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
    <div className="text-center">
      <h2>
        <Trans>Withdraw Nouns from escrow</Trans>
      </h2>
      <p>Withdrawing {props.tokenIds.map(nounId => `Noun ${nounId}`).join(', ')}</p>
      <p
        className={cn(
          'font-pt border-brand-border-light mb-4 rounded-lg border bg-white p-4 text-center text-[15px] font-bold',
          isTxSuccessful &&
            'text-brand-color-green border-brand-color-green bg-brand-color-green-translucent',
          isError &&
            'text-brand-color-red border-brand-color-red-translucent bg-brand-color-red-translucent',
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
        className={cn(
          'font-pt h-fit rounded-lg px-[16px] py-[10px] font-bold leading-[1] transition-all duration-150 ease-in-out',
          'border-2 border-black bg-white text-black no-underline hover:opacity-75',
          'border-brand-color-red text-brand-color-red',
        )}
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
