import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { t } from '@lingui/core/macro';
import { Plural, Trans } from '@lingui/react/macro';
import Link from 'next/link';
import { Alert } from 'react-bootstrap';

import link from '@/assets/icons/Link.svg';
import ShortAddress from '@/components/short-address';
import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Address, Hex } from '@/utils/types';
import { usePropose } from '@/wrappers/nouns-dao';
import { CandidateSignature, ProposalCandidate, useProposeBySigs } from '@/wrappers/nouns-data';

type Props = {
  isModalOpen: boolean;
  signatures: CandidateSignature[];
  requiredVotes: number;
  candidate: ProposalCandidate;
  blockNumber?: bigint;
  setIsModalOpen: (isOpen: boolean) => void;
  handleRefetchCandidateData: () => void;
  setDataFetchPollInterval: (interval: number) => void;
};

const SelectSponsorsToPropose = (props: Props) => {
  const [selectedSignatures, setSelectedSignatures] = React.useState<CandidateSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const { propose, proposeState } = usePropose();
  const [selectedVoteCount, setSelectedVoteCount] = useState<number>(0);
  useEffect(() => {
    const voteCount = selectedSignatures.reduce((acc, sig) => {
      const votes = sig.signer.voteCount ?? 0;
      return acc + votes;
    }, 0);
    setSelectedVoteCount(voteCount);
  }, [selectedSignatures]);

  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
  };
  const clearState = () => {
    props.setIsModalOpen(false);
    setSelectedSignatures([]);
    clearTransactionState();
  };

  const handleSubmission = async (selectedSignatures: CandidateSignature[]) => {
    clearTransactionState();
    const proposalSigs = selectedSignatures?.map((s: CandidateSignature) => ({
      sig: s.sig as `0x${string}`,
      signer: s.signer.id,
      expirationTimestamp: BigInt(s.expirationTimestamp),
    }));
    // sort sigs by address to ensure order matches update proposal sigs
    const sortedSigs = proposalSigs.toSorted((a, b) =>
      a.signer.toString().localeCompare(b.signer.toString()),
    );
    const { signatures, targets, values, description, calldatas } = props.candidate.version.content;
    if (selectedSignatures.length === 0) {
      await propose({
        args: [
          targets.map(v => v as Address),
          values.map(value => BigInt(value)),
          signatures,
          calldatas.map(v => v as Hex),
          description,
        ],
      });
    } else {
      await proposeBySigs({
        args: [
          sortedSigs,
          targets.map(v => v as Address),
          values.map(value => BigInt(value)),
          signatures,
          calldatas.map(v => v as Hex),
          description,
        ],
      });
    }
  };

  const handleProposeStateChange = useCallback(
    ({ errorMessage, status }: { errorMessage?: string; status: string }) => {
      switch (status) {
        case 'None':
          setIsLoading(false);
          break;
        case 'PendingSignature':
          setIsWaiting(true);
          break;
        case 'Mining':
          props.setDataFetchPollInterval(50);
          setIsWaiting(false);
          setIsLoading(true);
          break;
        case 'Success':
          props.handleRefetchCandidateData();
          setIsLoading(false);
          setIsTxSuccessful(true);
          setSelectedSignatures([]);
          break;
        case 'Fail':
          props.setDataFetchPollInterval(0);
          setErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          break;
        case 'Exception':
          props.setDataFetchPollInterval(0);
          setErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          setIsWaiting(false);
          break;
      }
    },
    [props, setSelectedSignatures],
  );

  useEffect(() => {
    if (selectedSignatures.length === 0) {
      handleProposeStateChange(proposeState);
    } else {
      handleProposeStateChange(proposeBySigsState);
    }
  }, [proposeBySigsState, proposeState, handleProposeStateChange, selectedSignatures]);

  const modalContent = (
    <div className={'font-normal'}>
      <h2>
        <Trans>Choose sponsors</Trans>
      </h2>
      <p>
        <Trans>
          Select signatures to submit with your proposal. The total number of signatures must be
          greater than the proposal threshold of {props.requiredVotes}.
        </Trans>
      </p>
      <Alert className={'mb-2'} variant="warning">
        <Trans>
          <strong>Note: </strong>
          All signers on an onchain proposal have permission to cancel the proposal.
        </Trans>
      </Alert>
      <div className={'my-[20px] flex flex-row items-end justify-between max-[991px]:flex-col'}>
        {selectedSignatures.length > 0 && (
          <div className={'w-[70%] max-[991px]:w-full'}>
            <p>
              <strong>
                <Trans>Select signatures</Trans>
              </strong>
            </p>
          </div>
        )}
        {props.signatures.length > 0 && !isTxSuccessful && selectedSignatures.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (selectedSignatures.length === props.signatures.length) {
                setSelectedSignatures([]);
              } else {
                setSelectedSignatures(props.signatures);
              }
            }}
            disabled={isWaiting || isLoading}
          >
            {selectedSignatures.length === props.signatures.length ? (
              <Trans>Unselect all</Trans>
            ) : (
              <Trans>Select all</Trans>
            )}
          </button>
        )}
      </div>
      <div className={'mt-[10px] flex flex-row flex-wrap items-center justify-center gap-[10px]'}>
        {props.signatures.map((signature: CandidateSignature) => {
          return (
            <button
              type="button"
              key={signature.sig}
              onClick={() => {
                if (selectedSignatures.includes(signature)) {
                  setSelectedSignatures(
                    selectedSignatures.filter(sig => sig.signer !== signature.signer),
                  );
                } else {
                  setSelectedSignatures([...selectedSignatures, signature]);
                }
              }}
              disabled={
                isWaiting ||
                isLoading ||
                isTxSuccessful ||
                signature.signer.activeOrPendingProposal === true
              }
              className={cn(
                'font-londrina rounded-12 relative w-full cursor-pointer border-2 border-black/25 bg-white p-[10px] text-left text-[20px] leading-none transition-all duration-200 ease-in-out hover:ring-2 hover:ring-inset hover:ring-black/25 disabled:cursor-not-allowed disabled:opacity-50 max-[991px]:w-full',
                selectedSignatures.includes(signature) && 'border-2 border-black/75',
              )}
            >
              <div className={'flex flex-row items-center justify-center gap-[10px]'}>
                <img
                  src={`https://noun.pics/${signature.signer.id}`}
                  alt={signature.signer.id}
                  width="48"
                  height="48"
                  style={{ borderRadius: '6px' }}
                />
                <ShortAddress address={signature.signer.id} />
                <p className={'text-brand-gray-dark-text m-0 p-0 text-[13px] font-bold'}>
                  <Plural value={signature.signer.voteCount ?? 0} one="# vote" other="# votes" />
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <div className={'my-[20px] text-center'}>
        {errorMessage === '' && !isTxSuccessful && (
          <button
            type="button"
            className={cn(
              'font-pt text-brand-gray-dark-text h-fit rounded-lg border-0 px-[16px] py-[10px] text-[22px] font-bold leading-none transition-all duration-150 ease-in-out',
              'mb-4 bg-black text-white no-underline hover:opacity-75 disabled:bg-neutral-300 disabled:hover:opacity-100',
              (isWaiting || isLoading) &&
                'font-pt border-brand-border-light text-brand-gray-dark-text w-full border bg-white p-4 text-center text-[15px] font-bold',
            )}
            disabled={selectedVoteCount < props.requiredVotes || isWaiting || isLoading}
            onClick={() => {
              handleSubmission(selectedSignatures);
            }}
          >
            {!isWaiting && !isLoading && (
              <>
                {selectedSignatures.length === 0 ? (
                  <Trans>Submit with no sponsors</Trans>
                ) : (
                  <Plural value={selectedVoteCount} one="Submit # vote" other="Submit # votes" />
                )}
              </>
            )}
            <span>
              {(isWaiting || isLoading) && (
                <img
                  src="/loading-noggles.svg"
                  alt={t`loading`}
                  className="mx-auto mb-2 block max-w-[45px]"
                />
              )}
              {isWaiting && <Trans>Awaiting confirmation</Trans>}
              {isLoading && <Trans>Submitting proposal</Trans>}
            </span>
          </button>
        )}
        {errorMessage !== '' && (
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
              <Trans>Try again</Trans>
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
              <strong>
                <Trans>Success!</Trans>
              </strong>{' '}
              <br />
              <a
                href={
                  proposeBySigsState.transaction?.hash
                    ? `${buildEtherscanTxLink(proposeBySigsState.transaction.hash)}`
                    : undefined
                }
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Your candidate is now a proposal</Trans>
                {proposeBySigsState.transaction != null && (
                  <img src={link} width={16} alt={t`link symbol`} />
                )}
              </a>
              <br />
              {(props.candidate.matchingProposalIds?.length ?? 0) > 0 && (
                <Link href={`/vote/${props?.candidate?.matchingProposalIds?.[0]}`}>
                  <Trans>View the proposal</Trans>
                </Link>
              )}
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
          setSelectedSignatures([]);
          clearState();
          props.setIsModalOpen(false);
        }}
        content={modalContent}
      />
    </>
  );
};

export default SelectSponsorsToPropose;
