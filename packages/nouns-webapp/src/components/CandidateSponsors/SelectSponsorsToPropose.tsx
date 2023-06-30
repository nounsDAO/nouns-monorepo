import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './SelectSponsorsToPropose.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import { InputGroup, FormText, FormControl, FormSelect, Spinner } from 'react-bootstrap'
import { Proposal, useAllProposals, useEscrowToFork, useJoinFork } from '../../wrappers/nounsDao'
import clsx from 'clsx'
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro'
import { TransactionStatus, useEthers } from '@usedapp/core'
import config from '../../config';
import { useSetApprovalForAll, useIsApprovedForAll, useSetApprovalForTokenId } from '../../wrappers/nounToken'
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  // isForkingPeriod: boolean;
  // title: string;
  // description: string;
  // selectLabel: string;
  // selectDescription: string;
  // account: string;
  // ownedNouns: number[] | undefined;
  // userEscrowedNouns: number[] | undefined;
  // refetchData: Function;
  // setDataFetchPollInterval: Function;
}

export default function SelectSponsorsToPropose(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [selectedProposals, setSelectedProposals] = React.useState<number[]>([]);
  const [selectedSignatures, setSelectedSignatures] = React.useState<CandidateSignature[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isTwoStepProcess, setIsTwoStepProcess] = React.useState(false);
  const [ownedNouns, setOwnedNouns] = useState<number[]>([]);
  // approval transactions
  const [isApprovalWaiting, setIsApprovalWaiting] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [approvalErrorMessage, setApprovalErrorMessage] = useState<ReactNode>('');
  const [isApprovalTxSuccessful, setIsApprovalTxSuccessful] = useState(false);
  const { setApproval, setApprovalState } = useSetApprovalForAll();
  // handle transactions 
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { joinFork, joinForkState } = useJoinFork();
  // etc
  const { data: proposals } = useAllProposals();
  const isApprovedForAll = useIsApprovedForAll();
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const proposalsList = proposals?.map((proposal, i) => {
    return (
      <option key={i} value={proposal.id}>{proposal.id} - {proposal.title}</option>
    )
  });

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

  // useEffect(() => {
  //   let nounIds = props.ownedNouns || [];
  //   if (props.ownedNouns && props.userEscrowedNouns) {
  //     const nouns = [...props.ownedNouns, ...props.userEscrowedNouns];
  //     nounIds = nouns.sort((a, b) => a - b);
  //   }
  //   setOwnedNouns(nounIds);
  // }, [props.ownedNouns, props.userEscrowedNouns]);

  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
    setIsApprovalWaiting(false);
    setIsApprovalLoading(false);
    setApprovalErrorMessage('');
    setIsApprovalTxSuccessful(false);
    setIsTwoStepProcess(false);
    // props.setDataFetchPollInterval(0);
  }
  const clearState = () => {
    setIsConfirmModalOpen(false);
    props.setIsModalOpen(false);
    setSelectedSignatures([]);
    setSelectedProposals([]);
    setReasonText('');
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


  const submitProposalOnChain = async () => {
    const proposalSigs = selectedSignatures?.map((s: any) => [s.sig, s.signer.id, s.expirationTimestamp]);
    await proposeBySigs(
      proposalSigs,
      props.candidate.version.targets,
      props.candidate.version.values,
      props.candidate.version.signatures,
      props.candidate.version.calldatas,
      props.candidate.version.description,
    );
  };


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
              approvalErrorMessage && clearTransactionState();
              props.signatures && selectedSignatures.length === props.signatures.length ?
                setSelectedSignatures([]) :
                setSelectedSignatures(props.signatures || [])
            }}
            disabled={isWaiting || isLoading || isApprovalWaiting || isApprovalLoading}
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
                // (approvalErrorMessage || errorMessage || isTxSuccessful) && clearTransactionState();
                selectedSignatures.includes(signature) ?
                  setSelectedSignatures(selectedSignatures.filter((sig) => sig.signer !== signature.signer)) :
                  setSelectedSignatures([...selectedSignatures, signature]);
              }}
              disabled={
                (isWaiting || isLoading || isApprovalWaiting || isApprovalLoading || isTxSuccessful)
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
        {!(approvalErrorMessage || errorMessage || isTxSuccessful || isApprovalTxSuccessful) && (
          <button
            className={clsx(classes.button, classes.primaryButton, (isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && classes.loadingButton)}
            disabled={
              selectedVoteCount < props.requiredVotes || isWaiting || isLoading || isApprovalWaiting || isApprovalLoading
            }
            onClick={() => {
              handleSubmission(selectedSignatures);
            }}
          >
            {!isWaiting && !isLoading && !isApprovalWaiting && !isApprovalLoading && (
              <>
                Submit {selectedVoteCount} votes
              </>
            )}
            <span>
              {(isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && <img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />}
              {(isApprovalWaiting) && 'Awaiting approval'}
              {(isWaiting) && 'Awaiting confirmation'}
              {isApprovalLoading && 'Approving'}
              {isLoading && `Submitting proposal`}
            </span>
          </button>
        )}
        {(approvalErrorMessage || errorMessage) && (
          <p className={clsx(classes.statusMessage, classes.errorMessage)}>
            {approvalErrorMessage || errorMessage}
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