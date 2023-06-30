import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './SelectSponsorsToPropose.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import clsx from 'clsx'
import { Trans } from '@lingui/macro'
import { TransactionStatus } from '@usedapp/core'
import { buildEtherscanTxLink } from '../../utils/etherscan'
import link from '../../assets/icons/Link.svg';
import { CandidateSignature, ProposalCandidate, useProposeBySigs } from '../../wrappers/nounsData'
import ShortAddress from '../ShortAddress'
import { Delegates } from '../../wrappers/subgraph'

type Props = {
  setIsModalOpen: Function;
  isModalOpen: boolean;
  signatures: CandidateSignature[];
  delegateSnapshot: Delegates;
  requiredVotes: number;
  candidate: ProposalCandidate;
}

export default function SelectSponsorsToPropose(props: Props) {
  const [selectedSignatures, setSelectedSignatures] = React.useState<CandidateSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const [selectedVoteCount, setSelectedVoteCount] = useState<number>(0);
  useEffect(() => {
    if (props.delegateSnapshot.delegates) {
      const voteCount = selectedSignatures.reduce((acc, sig) => {
        const votes = props.delegateSnapshot.delegates.find(
          delegate => delegate.id === sig.signer.id,
        )?.nounsRepresented.length || 0;
        return acc + votes;
      }, 0);
      setSelectedVoteCount(voteCount);
    }
  }, [selectedSignatures, props.delegateSnapshot.delegates]);

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

  const handleSubmission = async (selectedSignatures: CandidateSignature[]) => {
    clearTransactionState();
    const proposalSigs = selectedSignatures?.map((s: any) => [s.sig, s.signer.id, s.expirationTimestamp]);
    await proposeBySigs(
      proposalSigs,
      props.candidate.version.targets,
      props.candidate.version.values,
      props.candidate.version.signatures,
      props.candidate.version.calldatas,
      props.candidate.version.description,
    );
  }

  const handleProposeStateChange = useCallback((state: TransactionStatus) => {
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
        setSelectedSignatures([]);
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
    handleProposeStateChange(proposeBySigsState);
  }, [proposeBySigsState, handleProposeStateChange]);

  const modalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>
          Choose sponsors
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          Select signatures to submit with your proposal. The total number of signatures must be greater than the proposal threshold of {props.requiredVotes}.
        </Trans>
      </p>
      <div className={classes.sectionHeader}>
        <div className={classes.sectionLabel}>
          <p>
            <strong>
              <Trans>
                Select signatures
              </Trans>
            </strong>
          </p>
        </div>
        {props.signatures && !isTxSuccessful && (
          <button
            onClick={() => {
              props.signatures && selectedSignatures.length === props.signatures.length ?
                setSelectedSignatures([]) :
                setSelectedSignatures(props.signatures || [])
            }}
            disabled={isWaiting || isLoading}
          >
            {selectedSignatures.length === props.signatures?.length ? 'Unselect' : "Select"} all
          </button>
        )}
      </div>
      <div className={classes.list}>
        {props.signatures && props.signatures.map((signature: CandidateSignature) => {
          const voteCount = props.delegateSnapshot.delegates?.find(
            delegate => delegate.id === signature.signer.id,
          )?.nounsRepresented.length;
          return (
            <button
              onClick={() => {
                selectedSignatures.includes(signature) ?
                  setSelectedSignatures(selectedSignatures.filter((sig) => sig.signer !== signature.signer)) :
                  setSelectedSignatures([...selectedSignatures, signature]);
              }}
              disabled={
                (isWaiting || isLoading || isTxSuccessful)
              }
              className={clsx(
                classes.selectButton,
                selectedSignatures.includes(signature) && classes.selectedButton,
              )}
            >
              <div>
                <ShortAddress address={signature.signer.id} />
                <p className={classes.voteCount}>
                  {voteCount} vote{voteCount !== 1 && 's'}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      <div className={classes.modalActions}>
        {!(errorMessage || isTxSuccessful) && (
          <button
            className={clsx(classes.button, classes.primaryButton, (isWaiting || isLoading) && classes.loadingButton)}
            disabled={
              selectedVoteCount < props.requiredVotes || isWaiting || isLoading
            }
            onClick={() => {
              handleSubmission(selectedSignatures);
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