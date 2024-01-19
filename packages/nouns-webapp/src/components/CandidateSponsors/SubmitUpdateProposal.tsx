import { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './SelectSponsorsToPropose.module.css';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import link from '../../assets/icons/Link.svg';
import {
  CandidateSignature,
  ProposalCandidate,
  useUpdateProposalBySigs,
} from '../../wrappers/nounsData';
import { Link } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';

type Props = {
  isModalOpen: boolean;
  signatures: CandidateSignature[];
  candidate: ProposalCandidate;
  setIsModalOpen: Function;
  handleRefetchCandidateData: Function;
  setDataFetchPollInterval: Function;
  proposalIdToUpdate: string;
};

export default function SubmitUpdateProposal(props: Props) {
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
    const proposalSigs = props.signatures?.map(s => [s.sig, s.signer.id, s.expirationTimestamp]);
    // sort sigs by address to ensure order matches original candidate sigs
    const sortedSigs = proposalSigs.sort((a, b) => a[1].toString().localeCompare(b[1].toString()));
    await updateProposalBySigs(
      props.proposalIdToUpdate,
      sortedSigs,
      props.candidate.version.content.targets,
      props.candidate.version.content.values,
      props.candidate.version.content.signatures,
      props.candidate.version.content.calldatas,
      props.candidate.version.content.description,
      reason,
    );
  };

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
        <Trans>Update proposal</Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>Add an optional message for the changes to the proposal</Trans>
      </p>
      <FormControl
        as="textarea"
        placeholder={'Optional message'}
        value={reason}
        onChange={e => setReason(e.target.value)}
        className={classes.reasonTextarea}
      />
      <div className={classes.modalActions}>
        {!(errorMessage || isTxSuccessful) && (
          <button
            className={clsx(
              classes.button,
              classes.primaryButton,
              (isWaiting || isLoading) && classes.loadingButton,
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
                  className={classes.transactionModalSpinner}
                />
              )}
              {isWaiting && 'Awaiting confirmation'}
              {isLoading && `Submitting proposal`}
            </span>
          </button>
        )}

        {errorMessage && (
          <p className={clsx(classes.statusMessage, classes.errorMessage)}>
            {errorMessage}
            <button
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
                  updateProposalBySigsState.transaction &&
                  `${buildEtherscanTxLink(updateProposalBySigsState.transaction.hash)}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <Link to={`/vote/${props.proposalIdToUpdate}`}>
                  Proposal {props.proposalIdToUpdate} has been updated
                </Link>
                {updateProposalBySigsState.transaction && (
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
}
