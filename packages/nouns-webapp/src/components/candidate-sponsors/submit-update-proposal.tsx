import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import Link from 'next/link';
import { FormControl } from 'react-bootstrap';
import { isTruthy } from 'remeda';

import link from '@/assets/icons/Link.svg';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import {
  CandidateSignature,
  ProposalCandidate,
  useUpdateProposalBySigs,
} from '@/wrappers/nouns-data';

import SolidColorBackgroundModal from '../solid-color-background-modal';

type Props = {
  isModalOpen: boolean;
  signatures: CandidateSignature[];
  candidate: ProposalCandidate;
  setIsModalOpen: (isOpen: boolean) => void;
  handleRefetchCandidateData: () => void;
  setDataFetchPollInterval: (interval: number | null) => void;
  proposalIdToUpdate: string;
};

const SubmitUpdateProposal = (props: Readonly<Props>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [reason, setReason] = useState<string>('');
  const { updateProposalBySigs, updateProposalBySigsState } = useUpdateProposalBySigs();

  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
  };
  const clearState = () => {
    props.setIsModalOpen(false);
    clearTransactionState();
    setReason('');
  };
  const handleSubmitUpdateToProposal = async () => {
    clearTransactionState();
    // Create properly formatted signature objects
    const proposalSigs = props.signatures?.map(s => ({
      sig: s.sig as `0x${string}`,
      signer: s.signer.id as `0x${string}`,
      expirationTimestamp: BigInt(s.expirationTimestamp),
    }));
    // sort sigs by address to ensure order matches original candidate sigs
    const sortedSigs = proposalSigs.toSorted((a, b) =>
      a.signer.toString().localeCompare(b.signer.toString()),
    );
    await updateProposalBySigs({
      args: [
        BigInt(props.proposalIdToUpdate),
        sortedSigs,
        props.candidate.version.content.targets.map(target => target as `0x${string}`),
        props.candidate.version.content.values.map(value => BigInt(value)),
        props.candidate.version.content.signatures,
        props.candidate.version.content.calldatas.map(calldata => calldata as `0x${string}`),
        props.candidate.version.content.description,
        reason,
      ],
    });
  };

  const handleUpdateProposalStateChange = useCallback(
    ({ errorMessage, status }: { status: string; errorMessage?: string }) => {
      switch (status) {
        case 'None':
          setIsLoading(false);
          break;
        case 'PendingSignature':
          setIsWaiting(true);
          break;
        case 'Mining':
          setIsWaiting(false);
          setIsLoading(true);
          break;
        case 'Success':
          setIsLoading(false);
          setIsTxSuccessful(true);
          break;
        case 'Fail':
          setErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          break;
        case 'Exception':
          setErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          setIsWaiting(false);
          break;
      }
    },
    [],
  );

  useEffect(() => {
    handleUpdateProposalStateChange(updateProposalBySigsState);
  }, [updateProposalBySigsState, handleUpdateProposalStateChange]);
  const modalContent = (
    <div className="font-normal">
      <h2>
        <Trans>Update proposal</Trans>
      </h2>
      <p>
        <Trans>Add an optional message for the changes to the proposal</Trans>
      </p>
      <FormControl
        as="textarea"
        placeholder={'Optional message'}
        value={reason}
        onChange={e => setReason(e.target.value)}
        className="font-pt rounded-12 mb-[10px] w-full border-2 border-black/25 px-[12px] py-[10px] text-[16px] leading-normal"
      />
      <div className="my-[20px] text-center">
        {!(isTruthy(errorMessage) || isTxSuccessful) && (
          <button
            type="button"
            className={cn(
              'font-pt bg-brand-surface-pink text-brand-gray-dark-text h-fit rounded-lg border-0 px-[16px] py-[10px] text-[22px] font-bold leading-none transition-all duration-150 ease-in-out',
              'mb-4 text-white no-underline hover:opacity-75 disabled:bg-neutral-300 disabled:hover:opacity-100',
              (isWaiting || isLoading) &&
                'font-pt border-brand-border-light text-brand-gray-dark-text w-full border bg-white p-4 text-center text-[15px] font-bold',
            )}
            disabled={isWaiting || isLoading}
            onClick={() => {
              handleSubmitUpdateToProposal();
            }}
          >
            {!isWaiting && !isLoading && <>Submit update</>}
            <span>
              {(isWaiting || isLoading) && (
                <img
                  src="/loading-noggles.svg"
                  alt="loading"
                  className="mx-auto mb-2 block max-w-[45px]"
                />
              )}
              {isWaiting && 'Awaiting confirmation'}
              {isLoading && `Submitting proposal`}
            </span>
          </button>
        )}

        {isTruthy(errorMessage) && (
          <p
            className={cn(
              'font-pt border-brand-border-light text-brand-gray-dark-text mb-4 rounded-lg border bg-white px-8 py-4 text-center text-[15px] font-bold transition-all duration-150 ease-in-out',
              'border-brand-color-red-translucent bg-brand-color-red-translucent text-brand-color-red',
            )}
          >
            {errorMessage}
            <button
              type="button"
              onClick={() => {
                clearTransactionState();
              }}
            >
              Try again
            </button>
          </p>
        )}
        {isTxSuccessful && (
          <>
            <p
              className={cn(
                'font-pt border-brand-border-light text-brand-gray-dark-text mb-4 rounded-lg border bg-white px-8 py-4 text-center text-[15px] font-bold transition-all duration-150 ease-in-out',
                'border-brand-color-green bg-brand-color-green-translucent text-brand-color-green',
              )}
            >
              <strong>Success!</strong> <br />
              <span className="inline-flex items-center gap-2">
                <Link href={`/vote/${props.proposalIdToUpdate}`}>
                  Proposal {props.proposalIdToUpdate} has been updated
                </Link>
                {updateProposalBySigsState.transaction?.hash && (
                  <a
                    href={`${buildEtherscanTxLink(updateProposalBySigsState.transaction.hash)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <img src={link} width={16} alt="link symbol" />
                  </a>
                )}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SolidColorBackgroundModal
        show={props.isModalOpen}
        onDismiss={() => {
          clearState();
          props.setIsModalOpen(false);
        }}
        content={modalContent}
      />
    </>
  );
};
export default SubmitUpdateProposal;
