import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Alert } from 'react-bootstrap';

import link from '@/assets/icons/Link.svg';
import ShortAddress from '@/components/short-address';
import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Address, Hex } from '@/utils/types';
import { usePropose } from '@/wrappers/nounsDao';
import { CandidateSignature, ProposalCandidate, useProposeBySigs } from '@/wrappers/nounsData';
import { Link } from 'react-router';

import classes from './select-sponsors-to-propose.module.css';

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
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>Choose sponsors</Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          Select signatures to submit with your proposal. The total number of signatures must be
          greater than the proposal threshold of {props.requiredVotes}.
        </Trans>
      </p>
      <Alert className={classes.modalDescription} variant="warning">
        <Trans>
          <strong>Note: </strong>
          All signers on an onchain proposal have permission to cancel the proposal.
        </Trans>
      </Alert>
      <div className={classes.sectionHeader}>
        {selectedSignatures.length > 0 && (
          <div className={classes.sectionLabel}>
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
            {selectedSignatures.length === props.signatures.length ? 'Unselect' : 'Select'} all
          </button>
        )}
      </div>
      <div className={classes.list}>
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
              className={clsx(
                classes.selectButton,
                selectedSignatures.includes(signature) && classes.selectedButton,
              )}
            >
              <div>
                <ShortAddress address={signature.signer.id} />
                <p className={classes.voteCount}>
                  {signature.signer.voteCount} vote{signature.signer.voteCount !== 1 && 's'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <div className={classes.modalActions}>
        {errorMessage === '' && !isTxSuccessful && (
          <button
            type="button"
            className={clsx(
              classes.button,
              classes.primaryButton,
              (isWaiting || isLoading) && classes.loadingButton,
            )}
            disabled={selectedVoteCount < props.requiredVotes || isWaiting || isLoading}
            onClick={() => {
              handleSubmission(selectedSignatures);
            }}
          >
            {!isWaiting && !isLoading && (
              <>
                {selectedSignatures.length === 0 ? (
                  <>Submit with no sponsors</>
                ) : (
                  <>
                    Submit {selectedVoteCount} vote{selectedVoteCount > 1 && 's'}
                  </>
                )}
              </>
            )}
            <span>
              {(isWaiting || isLoading) && (
                <img
                  src="/loading-noggles.svg"
                  alt="loading"
                  className={classes.transactionModalSpinner}
                />
              )}
              {isWaiting && 'Awaiting confirmation'}
              {isLoading && `Submitting proposal`}
            </span>
          </button>
        )}
        {errorMessage !== '' && (
          <p className={clsx(classes.statusMessage, classes.errorMessage)}>
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
            <p className={clsx(classes.statusMessage, classes.successMessage)}>
              <strong>Success!</strong> <br />
              <a
                href={
                  proposeBySigsState.transaction?.hash
                    ? `${buildEtherscanTxLink(proposeBySigsState.transaction.hash)}`
                    : undefined
                }
                target="_blank"
                rel="noreferrer"
              >
                Your candidate is now a proposal
                {proposeBySigsState.transaction != null && (
                  <img src={link} width={16} alt="link symbol" />
                )}
              </a>
              <br />
              {(props.candidate.matchingProposalIds?.length ?? 0) > 0 && (
                <Link to={`/vote/${props.candidate.matchingProposalIds[0]}`}>
                  View the proposal
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
