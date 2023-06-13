import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './AddNounsToForkModal.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import { InputGroup, FormText, FormControl, FormSelect } from 'react-bootstrap'
import { useAllProposals, useEscrowToFork } from '../../wrappers/nounsDao'
import clsx from 'clsx'
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro'
import { current } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { TransactionStatus, useEthers } from '@usedapp/core'
import { useBlockNumber } from '@usedapp/core';
import { useGetOwnedNounIds } from '../../hooks/useGetOwnedNounIds'
import { useQuery } from '@apollo/client'
import { Delegates, currentlyDelegatedNouns, delegateNounsAtBlockQuery } from '../../wrappers/subgraph'
import config from '../../config';
import { useSetApprovalForAll } from '../../wrappers/nounToken'
type Props = {
  setIsModalOpen: Function;
  isModalOpen: boolean;
  isForkingPeriod: boolean;
  title: string;
  description: string;
  selectLabel: string;
  selectDescription: string;
  account: string;
}

const dummyData = {
  ownedNouns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}

export default function AddNounsToForkModal(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [selectedProposals, setSelectedProposals] = React.useState<number[]>([]);
  const [selectedNouns, setSelectedNouns] = React.useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  const { data: proposals } = useAllProposals();
  const proposalsList = proposals?.map((proposal, i) => {
    return (
      <option key={i} value={proposal.id}>{proposal.id} - {proposal.title}</option>
    )
  });

  // get owned nouns
  // const { account } = useEthers();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    // TODO: This isn't working without hardcoding the address in subgraph.ts
    currentlyDelegatedNouns(props.account ?? ''),
  );
  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, number[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => +nr.id) ?? [];
    return acc;
  }, {});
  const ownedNouns = Object.values(delegateToNounIds ?? {}).flat();
  console.log('account', props.account)
  console.log('ownedNouns', ownedNouns, delegates)
  // handle transactions 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { setApproval, setApprovalState } = useSetApprovalForAll();

  const handleSubmission = () => {
    // if forking period 

    // if escrow period
    // escrowToFork([27], [1], "the reason");

  }
  const handleEscrowToFork = () => {
    // escrowToFork(27, 1, "the reason");
    // escrowToFork();
  }
  const handleSetApproval = () => {
    setApproval(config.addresses.nounsDAOProxy, true);
  }

  const handleSetApprovalStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        break;
      case 'Fail':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        break;
      case 'Exception':
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        break;
    }
  }, []);

  const handleEscrowToForkStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        // setIsVoteSuccessful(true);
        break;
      case 'Fail':
        // setFailureCopy(<Trans>Transaction Failed</Trans>);
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        // setIsVoteFailed(true);
        break;
      case 'Exception':
        // setFailureCopy(<Trans>Error</Trans>);
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        // setIsVoteFailed(true);
        break;
    }
  }, []);

  useEffect(() => {
    handleEscrowToForkStateChange(escrowToForkState);
  }, [escrowToForkState, handleEscrowToForkStateChange]);

  useEffect(() => {
    handleSetApprovalStateChange(setApprovalState);
  }, [setApprovalState, handleSetApprovalStateChange]);

  const confirmModalContent = (
    <div className={classes.confirmModalContent}>
      <h2 className={classes.modalTitle}>Confirm</h2>
      <p className={classes.modalDescription}>By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone.</p>
      <button className={clsx(classes.button, classes.primaryButton)}
      // onClick={() => setIsConfirmModalOpen(false)}
      >Join</button>
      <button className={clsx(classes.button, classes.secondaryButton)}
        onClick={() => setIsConfirmModalOpen(false)}
      >Cancel</button>
    </div>
  );

  const modalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>
          Add Nouns to escrow
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals.
        </Trans>
      </p>
      <div className={classes.fields}>
        <InputGroup className={classes.inputs}>
          <div>
            <FormText><strong>Reason</strong> (optional)</FormText>
            <FormControl
              className={classes.reasonInput}
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder={"Your reason for forking"}
            />
          </div>
          <div>
            <FormText><strong>Proposals that triggered this decision</strong> (optional)</FormText>
            <FormSelect
              className={classes.selectMenu}
              onChange={(e) => {
                setSelectedProposals([...selectedProposals, +e.target.value]);
              }}
            >
              <option>Select proposal(s)</option>
              {proposalsList}
            </FormSelect>
          </div>
        </InputGroup>
      </div>
      <div className={classes.selectedProposals}>
        {selectedProposals.map((proposalId) => {
          const prop = proposals.find((proposal) => proposal.id && +proposal.id === proposalId);
          return (
            <div className={classes.selectedProposal}>
              <span><a href={`/vote/${prop?.id}`} target="_blank" rel="noreferrer"><strong>{prop?.id}</strong> {prop?.title}</a></span>
              <button
                onClick={() => {
                  const newSelectedProposals = selectedProposals.filter((id) => id !== proposalId);
                  setSelectedProposals(newSelectedProposals);
                }}
                className={classes.removeButton}><MinusCircleIcon /></button>
            </div>
          )
        })
        }
      </div>
      <div className={classes.sectionHeader}>
        <div className={classes.sectionLabel}>
          <p>
            <strong>
              <Trans>
                Select Nouns to escrow
              </Trans>
            </strong>
          </p>
          <p>
            <Trans>
              Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.
            </Trans>
          </p>
        </div>
        <button
          onClick={() => {
            selectedNouns.length === ownedNouns.length ?
              setSelectedNouns([]) :
              setSelectedNouns(ownedNouns)
          }}
        >{selectedNouns.length === ownedNouns.length ? 'Unselect' : "Select"} all</button>
      </div>
      <div className={classes.nounsList}>
        {ownedNouns.map((nounId) => {
          return (
            <button
              onClick={() => {
                selectedNouns.includes(nounId) ?
                  setSelectedNouns(selectedNouns.filter((id) => id !== nounId)) :
                  setSelectedNouns([...selectedNouns, nounId]);
              }}
              className={clsx(classes.nounButton, selectedNouns.includes(nounId) && classes.selectedNounButton)}
            >
              <img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} />
              Noun {nounId}
            </button>
          )
        })}
      </div>
      <div className={classes.modalActions}>
        <button
          className={clsx(classes.button, classes.primaryButton)}
          disabled={selectedNouns.length === 0}
          onClick={() => {
            // props.isForkingPeriod ? setIsConfirmModalOpen(true) : props.setIsModalOpen(false)
            handleSubmission()
          }}
        >
          Add {selectedNouns.length > 0 && selectedNouns.length} Nouns to {props.isForkingPeriod ? 'fork' : 'escrow'}
        </button>
        <p>
          {selectedNouns.map((nounId) => `Noun ${nounId}`).join(', ')}
        </p>
      </div>
    </div >

  )
  const forkingModalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>
          Join the fork
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone.
        </Trans>
      </p>
      <div className={classes.fields}>
        <InputGroup className={classes.inputs}>
          <div>
            <FormText><strong>Reason</strong> (optional)</FormText>
            <FormControl
              className={classes.reasonInput}
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder={"Your reason for forking"}
            />
          </div>
          <div>
            <FormText><strong>Proposals that triggered this decision</strong> (optional)</FormText>
            <FormSelect
              className={classes.selectMenu}
              onChange={(e) => {
                setSelectedProposals([...selectedProposals, +e.target.value]);
              }}
            >
              <option>Select proposal(s)</option>
              {proposalsList}
            </FormSelect>
          </div>
        </InputGroup>
      </div>
      <div className={classes.selectedProposals}>
        {selectedProposals.map((proposalId) => {
          const prop = proposals.find((proposal) => proposal.id && +proposal.id === proposalId);
          return (
            <div className={classes.selectedProposal}>
              <span><a href={`/vote/${prop?.id}`} target="_blank" rel="noreferrer"><strong>{prop?.id}</strong> {prop?.title}</a></span>
              <button
                onClick={() => {
                  const newSelectedProposals = selectedProposals.filter((id) => id !== proposalId);
                  setSelectedProposals(newSelectedProposals);
                }}
                className={classes.removeButton}><MinusCircleIcon /></button>
            </div>
          )
        })
        }
      </div>
      <div className={classes.sectionHeader}>
        <div className={classes.sectionLabel}>
          <p>
            <strong>
              <Trans>
                Select Nouns to join the fork
              </Trans>
            </strong>
          </p>
          <p>
            <Trans>
              Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the forking period
            </Trans>
          </p>
        </div>
        <button
          onClick={() => {
            selectedNouns.length === ownedNouns.length ?
              setSelectedNouns([]) :
              setSelectedNouns(ownedNouns)
          }}
        >{selectedNouns.length === ownedNouns.length ? 'Unselect' : "Select"} all</button>
      </div>
      <div className={classes.nounsList}>
        {dummyData.ownedNouns.map((nounId) => {
          return (
            <button
              onClick={() => {
                selectedNouns.includes(nounId) ?
                  setSelectedNouns(selectedNouns.filter((id) => id !== nounId)) :
                  setSelectedNouns([...selectedNouns, nounId]);
              }}
              className={clsx(classes.nounButton, selectedNouns.includes(nounId) && classes.selectedNounButton)}
            >
              <img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} />
              Noun {nounId}
            </button>
          )
        })}
      </div>
      <div className={classes.modalActions}>
        <button
          className={clsx(classes.button, classes.primaryButton)}
          disabled={selectedNouns.length === 0}
          onClick={() => {
            handleSubmission()
          }}
        // onClick={() => {
        //   props.isForkingPeriod ? setIsConfirmModalOpen(true) : props.setIsModalOpen(false)
        // }}
        >
          Add {selectedNouns.length > 0 && selectedNouns.length} Nouns to {props.isForkingPeriod ? 'fork' : 'escrow'}
        </button>
        <p>
          {selectedNouns.map((nounId) => `Noun ${nounId}`).join(', ')}
        </p>
      </div>
    </div >

  )
  return (
    <>
      <SolidColorBackgroundModal
        show={props.isModalOpen && !isConfirmModalOpen}
        onDismiss={() => {
          props.setIsModalOpen(false);
          setIsConfirmModalOpen(false);
        }}
        content={props.isForkingPeriod ? forkingModalContent : modalContent}
      />
      <SolidColorBackgroundModal
        show={isConfirmModalOpen}
        onDismiss={() => setIsConfirmModalOpen(false)}
        content={confirmModalContent}
      />
    </>
  )
}