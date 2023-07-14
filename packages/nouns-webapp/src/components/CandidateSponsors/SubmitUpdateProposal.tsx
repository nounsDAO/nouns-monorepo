import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './SelectSponsorsToPropose.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import clsx from 'clsx'
import { Trans } from '@lingui/macro'
import { TransactionStatus } from '@usedapp/core'
import { buildEtherscanTxLink } from '../../utils/etherscan'
import link from '../../assets/icons/Link.svg';
import { CandidateSignature, ProposalCandidate, useProposeBySigs, useUpdateProposalBySigs } from '../../wrappers/nounsData'
import ShortAddress from '../ShortAddress'
import { Delegates } from '../../wrappers/subgraph'
import { useActivePendingUpdatableProposers } from '../../wrappers/nounsDao'

type Props = {
  isModalOpen: boolean;
  signatures: CandidateSignature[];
  candidate: ProposalCandidate;
  blockNumber: number;
  setIsModalOpen: Function;
  handleRefetchCandidateData: Function;
  setDataFetchPollInterval: Function;
  proposalIdToUpdate: string;
}

export default function SubmitUpdateProposal(props: Props) {
  const [selectedSignatures, setSelectedSignatures] = React.useState<CandidateSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const [selectedVoteCount, setSelectedVoteCount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const activePendingProposers = useActivePendingUpdatableProposers(props.blockNumber);
  const { updateProposalBySigs, updateProposalBySigsState } = useUpdateProposalBySigs();


  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
  }
  const clearState = () => {
    props.setIsModalOpen(false);
    setSelectedSignatures([]);
    clearTransactionState();
  }
  const handleSubmitUpdateToProposal = async () => {
    clearTransactionState();
    const proposalSigs = props.signatures?.map((s) => [s.sig, s.signer.id, s.expirationTimestamp]);
    await updateProposalBySigs(
      props.proposalIdToUpdate,
      proposalSigs,
      props.candidate.version.content.targets,
      props.candidate.version.content.values,
      props.candidate.version.content.signatures,
      props.candidate.version.content.calldatas,
      props.candidate.version.content.description,
      reason // TODO: where to put an update message?
    );
  }


  const handleUpdateProposalStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
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
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        break;
      case 'Exception':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        setIsWaiting(false);
        break;
    }
  }, []);

  useEffect(() => {
    handleUpdateProposalStateChange(updateProposalBySigsState);
  }, [updateProposalBySigsState, handleUpdateProposalStateChange]);

  const modalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>
          Submit onchain
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          Add an optional message for the changes to the proposal
        </Trans>
      </p>

      <div className={classes.modalActions}>
        {!(errorMessage || isTxSuccessful) && (
          <button
            className={clsx(classes.button, classes.primaryButton, (isWaiting || isLoading) && classes.loadingButton)}
            disabled={
              isWaiting || isLoading
            }
            onClick={() => {
              handleSubmitUpdateToProposal();
            }}
          >
            {!isWaiting && !isLoading && (
              <>
                Submit {selectedVoteCount} votes
              </>
            )}
            <span>
              {(isWaiting || isLoading) && <img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />}
              {(isWaiting) && 'Awaiting confirmation'}
              {isLoading && `Submitting proposal`}
            </span>
          </button>
        )}
        {(errorMessage) && (
          <p className={clsx(classes.statusMessage, classes.errorMessage)}>
            {errorMessage}
            <button
              onClick={() => {
                clearTransactionState();
              }}
            >Try again</button>
          </p>
        )}
        {isTxSuccessful && (
          <>
            <p className={clsx(classes.statusMessage, classes.successMessage)}>
              <strong>Success!</strong> <br />
              <a href={proposeBySigsState.transaction && `${buildEtherscanTxLink(proposeBySigsState.transaction.hash)}`} target="_blank" rel="noreferrer">
                Your candidate is now a proposal
                {proposeBySigsState.transaction && (
                  <img src={link} width={16} alt="link symbol" />
                )}
              </a>
            </p>
          </>
        )}
      </div>

    </div >
  )

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
  )
}