import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { FormControl } from 'react-bootstrap';

import link from '@/assets/icons/Link.svg';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import {
  CandidateSignature,
  ProposalCandidate,
  useUpdateProposalBySigs,
} from '@/wrappers/nouns-data';
import { Link } from 'react-router';

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
        className="font-pt mb-[10px] w-full rounded-[12px] border-2 border-[rgba(0,0,0,0.25)] px-[12px] py-[10px] text-[16px] leading-normal"
      />
      <div className="my-[20px] text-center">
        {!(Boolean(errorMessage) || isTxSuccessful) && (
          <button
            type="button"
            className={cn(
              'font-pt h-fit rounded-[8px] border-0 bg-[#faf4f8] px-[16px] py-[10px] text-[22px] font-bold leading-none text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
              'mb-4 text-white no-underline hover:opacity-75 disabled:bg-[#ccc] disabled:hover:opacity-100',
              (isWaiting || isLoading) &&
                'font-pt w-full border border-[#e6e6e6] bg-white p-4 text-center text-[15px] font-bold text-[var(--brand-gray-dark-text)]',
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

        {Boolean(errorMessage) && (
          <p
            className={cn(
              'font-pt mb-4 rounded-[8px] border border-[#e6e6e6] bg-white px-8 py-4 text-center text-[15px] font-bold text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
              'border-[var(--brand-color-red-translucent)] bg-[var(--brand-color-red-translucent)] text-[var(--brand-color-red)]',
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
                'font-pt mb-4 rounded-[8px] border border-[#e6e6e6] bg-white px-8 py-4 text-center text-[15px] font-bold text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
                'border-[var(--brand-color-green)] bg-[var(--brand-color-green-translucent)] text-[var(--brand-color-green)]',
              )}
            >
              <strong>Success!</strong> <br />
              <a
                href={
                  updateProposalBySigsState.transaction?.hash &&
                  `${buildEtherscanTxLink(updateProposalBySigsState.transaction.hash)}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-[var(--brand-color-green)] no-underline"
              >
                <Link to={`/vote/${props.proposalIdToUpdate}`}>
                  Proposal {props.proposalIdToUpdate} has been updated
                </Link>
                {updateProposalBySigsState.transaction != null && (
                  <img src={link} width={16} alt="link symbol" />
                )}
              </a>
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
