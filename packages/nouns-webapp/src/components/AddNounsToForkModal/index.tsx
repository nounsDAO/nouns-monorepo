import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './AddNounsToForkModal.module.css';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import { InputGroup, FormText, FormControl, FormSelect, Spinner } from 'react-bootstrap';
import { useAllProposals, useEscrowToFork, useJoinFork } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import config from '../../config';
import { useSetApprovalForAll, useIsApprovedForAll } from '../../wrappers/nounToken';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import link from '../../assets/icons/Link.svg';

type Props = {
  setIsModalOpen: Function;
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  isForkingPeriod: boolean;
  title: string;
  description: string;
  selectLabel: string;
  selectDescription: string;
  account: string;
  ownedNouns: number[] | undefined;
  userEscrowedNouns: number[] | undefined;
  refetchData: Function;
  setDataFetchPollInterval: Function;
  setIsConfirmModalOpen: Function;
};

export default function AddNounsToForkModal(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [selectedProposals, setSelectedProposals] = React.useState<number[]>([]);
  const [selectedNouns, setSelectedNouns] = React.useState<number[]>([]);
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
  const proposalsList = proposals
    ?.map((proposal, i) => {
      return (
        <option
          key={i}
          value={proposal.id}
          disabled={proposal.id && selectedProposals.includes(+proposal.id) ? true : false}
        >
          {proposal.id} - {proposal.title}
        </option>
      );
    })
    .reverse();

  useEffect(() => {
    let nounIds = props.ownedNouns || [];
    if (props.ownedNouns && props.userEscrowedNouns) {
      const nouns = [...props.ownedNouns, ...props.userEscrowedNouns];
      nounIds = nouns.sort((a, b) => a - b);
    }
    setOwnedNouns(nounIds);
  }, [props.ownedNouns, props.userEscrowedNouns]);

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
    props.setDataFetchPollInterval(0);
  };
  const clearState = () => {
    props.setIsConfirmModalOpen(false);
    props.setIsModalOpen(false);
    setSelectedNouns([]);
    setSelectedProposals([]);
    setReasonText('');
    clearTransactionState();
  };

  const handleSubmission = (selectedNouns: number[]) => {
    clearTransactionState();
    if (isApprovedForAll) {
      // if approved for all
      addNounsToEscrow(selectedNouns);
    } else {
      setIsTwoStepProcess(true);
      setApproval(config.addresses.nounsDAOProxy, true);
    }
  };

  const addNounsToEscrow = (selectedNouns: number[]) => {
    setIsWaiting(true);
    setIsLoading(false);
    if (props.isForkingPeriod) {
      joinFork(selectedNouns, selectedProposals, reasonText);
    } else {
      escrowToFork(selectedNouns, selectedProposals, reasonText);
    }
  };

  const handleSetApprovalForAllAndAddToEscrowStateChange = useCallback(
    (state: TransactionStatus, selectedNouns: number[]) => {
      switch (state.status) {
        case 'None':
          setIsApprovalLoading(false);
          break;
        case 'PendingSignature':
          setIsApprovalWaiting(true);
          break;
        case 'Mining':
          setIsApprovalLoading(true);
          setIsApprovalWaiting(false);
          break;
        case 'Success':
          setIsApprovalLoading(false);
          setIsApprovalTxSuccessful(true);
          // successfully approved, now escrow
          addNounsToEscrow(selectedNouns);
          break;
        case 'Fail':
          setApprovalErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
          setIsApprovalLoading(false);
          break;
        case 'Exception':
          setApprovalErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
          setIsApprovalLoading(false);
          setIsApprovalWaiting(false);
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [],
  );

  const handleAddToForkStateChange = useCallback((state: TransactionStatus) => {
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
        // poll for data to catch when nouns have been added to escrow, fallback if refresh doesn't catch it
        props.setDataFetchPollInterval(20);
        break;
      case 'Success':
        setIsLoading(false);
        setIsTxSuccessful(true);
        // if successful, disable nouns in list from being added to escrow again
        props.refetchData();
        setSelectedNouns([]);
        break;
      case 'Fail':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        props.setDataFetchPollInterval(0);
        break;
      case 'Exception':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        setIsWaiting(false);
        props.setDataFetchPollInterval(0);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.isForkingPeriod) {
      handleAddToForkStateChange(joinForkState);
    } else {
      handleAddToForkStateChange(escrowToForkState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrowToForkState, joinForkState, handleAddToForkStateChange]);

  useEffect(() => {
    handleSetApprovalForAllAndAddToEscrowStateChange(setApprovalState, selectedNouns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setApprovalState, handleSetApprovalForAllAndAddToEscrowStateChange]);

  const confirmModalContent = (
    <div className={classes.confirmModalContent}>
      <h2 className={classes.modalTitle}>Confirm</h2>
      <p className={classes.modalDescription}>
        By joining this fork you are giving up your Nouns to be retrieved in the new fork. This
        cannot be undone.
      </p>
      <button
        className={clsx(classes.button, classes.primaryButton)}
        onClick={() => {
          props.setIsConfirmModalOpen(false);
          props.setIsModalOpen(true);
        }}
      >
        Join
      </button>
      <button
        className={clsx(classes.button, classes.secondaryButton)}
        onClick={() => {
          props.setIsConfirmModalOpen(false);
        }}
      >
        Cancel
      </button>
    </div>
  );

  const modalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        {props.isForkingPeriod ? 'Join fork' : 'Add Nouns to escrow'}
      </h2>

      <p className={classes.modalDescription}>
        {!props.isForkingPeriod ? (
          <>
            Nouners can withdraw their tokens from escrow as long as the forking period hasn't
            started. Nouns in escrow are not eligible to vote or submit proposals.
          </>
        ) : (
          <>
            By joining this fork you are giving up your Nouns to be retrieved in the new fork. This
            cannot be undone.
          </>
        )}
      </p>

      <div className={classes.fields}>
        <InputGroup className={classes.inputs}>
          <div>
            <FormText>
              <strong>Reason</strong> (optional)
            </FormText>
            <FormControl
              aria-label="Your reason for forking"
              className={classes.reasonInput}
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder={'Your reason for forking'}
            />
          </div>
          <div>
            <FormText>
              <strong>Proposals that triggered this decision</strong> (optional)
            </FormText>
            <FormSelect
              aria-label="Select proposal(s)"
              className={classes.selectMenu}
              onChange={e => {
                setSelectedProposals([+e.target.value, ...selectedProposals]);
              }}
            >
              <option selected={true} disabled={true}>
                Select proposal(s)
              </option>
              {proposalsList}
            </FormSelect>
          </div>
        </InputGroup>
      </div>
      <div className={classes.selectedProposals}>
        {selectedProposals.map((proposalId, i) => {
          const prop = proposals.find(proposal => proposal.id && +proposal.id === proposalId);
          return (
            <div className={classes.selectedProposal} key={i}>
              <span>
                <a href={`/vote/${prop?.id}`} target="_blank" rel="noreferrer">
                  <strong>{prop?.id}</strong> {prop?.title}
                </a>
              </span>
              <button
                onClick={() => {
                  const newSelectedProposals = selectedProposals.filter(id => id !== proposalId);
                  setSelectedProposals(newSelectedProposals);
                }}
                className={classes.removeButton}
              >
                <MinusCircleIcon />
              </button>
            </div>
          );
        })}
      </div>
      <div className={classes.sectionHeader}>
        <div className={classes.sectionLabel}>
          <p>
            <strong>Select Nouns to {props.isForkingPeriod ? 'join fork' : 'to escrow'}</strong>
          </p>
          <p>
            <Trans>
              Add as many or as few of your Nouns as you’d like. Additional Nouns can be added
              during the escrow and forking periods.
            </Trans>
          </p>
        </div>
        {props.userEscrowedNouns &&
          ownedNouns &&
          ownedNouns?.length > props.userEscrowedNouns.length && (
            <button
              onClick={() => {
                approvalErrorMessage && clearTransactionState();
                props.ownedNouns && selectedNouns.length === props.ownedNouns.length
                  ? setSelectedNouns([])
                  : setSelectedNouns(props.ownedNouns || []);
              }}
              disabled={isWaiting || isLoading || isApprovalWaiting || isApprovalLoading}
            >
              {selectedNouns.length === props.ownedNouns?.length ? 'Unselect' : 'Select'} all
            </button>
          )}
      </div>
      <div className={classes.nounsList}>
        {ownedNouns &&
          ownedNouns.map((nounId: number) => {
            return (
              <button
                onClick={() => {
                  (approvalErrorMessage || errorMessage || isTxSuccessful) &&
                    clearTransactionState();
                  selectedNouns.includes(nounId)
                    ? setSelectedNouns(selectedNouns.filter(id => id !== nounId))
                    : setSelectedNouns([...selectedNouns, nounId]);
                }}
                disabled={
                  isWaiting ||
                  isLoading ||
                  isApprovalWaiting ||
                  isApprovalLoading ||
                  props.userEscrowedNouns?.includes(nounId)
                }
                className={clsx(
                  classes.nounButton,
                  selectedNouns.includes(nounId) && classes.selectedNounButton,
                  props.userEscrowedNouns?.includes(nounId) && classes.escrowedNoun,
                )}
                key={nounId}
              >
                <div>
                  <img
                    src={`https://noun.pics/${nounId}`}
                    alt="noun"
                    className={classes.nounImage}
                  />
                  Noun {nounId}
                </div>
                {props.userEscrowedNouns?.includes(nounId) && (
                  <span className={classes.escrowedNounLabel}>
                    {props.isForkingPeriod ? 'in fork' : 'in escrow'}
                  </span>
                )}
              </button>
            );
          })}
      </div>
      <div className={classes.modalActions}>
        {!(approvalErrorMessage || errorMessage || isTxSuccessful || isApprovalTxSuccessful) && (
          <button
            className={clsx(
              classes.button,
              classes.primaryButton,
              (isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) &&
              classes.loadingButton,
            )}
            disabled={
              selectedNouns.length === 0 ||
              isWaiting ||
              isLoading ||
              isApprovalWaiting ||
              isApprovalLoading
            }
            onClick={() => {
              handleSubmission(selectedNouns);
            }}
          >
            {!isWaiting && !isLoading && !isApprovalWaiting && !isApprovalLoading && (
              <>
                Add {selectedNouns.length > 0 && selectedNouns.length} Noun
                {selectedNouns.length === 1 ? '' : 's'} to{' '}
                {props.isForkingPeriod ? 'fork' : 'escrow'}
              </>
            )}
            <span>
              {(isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && (
                <img
                  src="/loading-noggles.svg"
                  alt="loading"
                  className={classes.transactionModalSpinner}
                />
              )}
              {isApprovalWaiting && 'Awaiting approval'}
              {isWaiting && 'Awaiting confirmation'}
              {isApprovalLoading && 'Approving'}
              {isLoading && `Adding to ${props.isForkingPeriod ? 'fork' : 'escrow'}`}
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
            >
              Try again
            </button>
          </p>
        )}
        {isTxSuccessful && (
          <>
            <p className={clsx(classes.statusMessage, classes.successMessage)}>
              <a
                href={
                  escrowToForkState.transaction &&
                  `${buildEtherscanTxLink(escrowToForkState.transaction.hash)}`
                }
                target="_blank"
                rel="noreferrer"
              >
                Your Nouns have been added to {props.isForkingPeriod ? 'the fork' : 'escrow'}
                {escrowToForkState.transaction && <img src={link} width={16} alt="link symbol" />}
              </a>
              {props.userEscrowedNouns &&
                ownedNouns &&
                ownedNouns?.length > props.userEscrowedNouns.length && (
                  <button
                    onClick={() => {
                      clearTransactionState();
                    }}
                  >
                    Add additional Nouns
                  </button>
                )}
            </p>
          </>
        )}
        {isTwoStepProcess && (
          <>
            <ul className={classes.steps}>
              <li>
                <strong>
                  {(isApprovalWaiting || isApprovalLoading) && (
                    <span className={classes.spinner}>
                      <Spinner animation="border" />
                    </span>
                  )}
                  {isApprovalTxSuccessful && (
                    <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                  )}
                  {approvalErrorMessage && (
                    <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                  )}
                </strong>
                <Trans>Set approval</Trans>
              </li>
              <li>
                <strong>
                  {(isWaiting || isLoading) && (
                    <span className={classes.spinner}>
                      <Spinner animation="border" />
                    </span>
                  )}
                  {isTxSuccessful && (
                    <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                  )}
                  {(errorMessage || approvalErrorMessage) && (
                    <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                  )}
                  {!(
                    isWaiting ||
                    isLoading ||
                    isTxSuccessful ||
                    errorMessage ||
                    approvalErrorMessage
                  ) && <span className={classes.placeholder}></span>}
                </strong>
                <Trans>Add to escrow</Trans>
              </li>
            </ul>
          </>
        )}
        {!isApprovedForAll && (!isApprovalWaiting || !isApprovalLoading) && (
          <p className={classes.approvalNote}>You'll be asked to approve access</p>
        )}
        {selectedNouns.length > 0 && !isTxSuccessful && (
          <>
            <p className={classes.selectedNouns}>
              Adding {selectedNouns.map(nounId => `Noun ${nounId}`).join(', ')}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SolidColorBackgroundModal
        show={props.isModalOpen && !props.isConfirmModalOpen}
        onDismiss={() => {
          setSelectedNouns([]);
          clearState();
        }}
        content={modalContent}
      />
      <SolidColorBackgroundModal
        show={props.isConfirmModalOpen}
        onDismiss={() => props.setIsConfirmModalOpen(false)}
        content={confirmModalContent}
      />
    </>
  );
}
