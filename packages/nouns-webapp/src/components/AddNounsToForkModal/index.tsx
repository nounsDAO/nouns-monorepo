import React from 'react'
import classes from './AddNounsToForkModal.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import { InputGroup, FormText, FormControl, FormSelect } from 'react-bootstrap'
import { useAllProposals } from '../../wrappers/nounsDao'
import clsx from 'clsx'
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro'
type Props = {
  setIsModalOpen: Function;
  isModalOpen: boolean;
  isForkingPeriod: boolean;
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
  const proposalsList = proposals?.map((proposal) => {
    return (
      <option value={proposal.id}>{proposal.id} - {proposal.title}</option>
    )
  });

  // set data 
  const ownedNouns = dummyData.ownedNouns;
  const allNounIds = ownedNouns.map((nounId) => nounId);


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
          {props.isForkingPeriod ? 'Join the fork' : 'Add Nouns to escrow'}
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          {props.isForkingPeriod ? "By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone." : "Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals."}
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
                {props.isForkingPeriod ? 'Select Nouns to join the fork' : 'Select Nouns to escrow'}
              </Trans>
            </strong>
          </p>
          <p>
            <Trans>
              {props.isForkingPeriod ? 'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the forking period' : 'Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.'}
            </Trans>
          </p>
        </div>
        <button
          onClick={() => {
            selectedNouns.length === allNounIds.length ?
              setSelectedNouns([]) :
              setSelectedNouns(allNounIds)
          }}
        >{selectedNouns.length === allNounIds.length ? 'Unselect' : "Select"} all</button>
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
            props.isForkingPeriod ? setIsConfirmModalOpen(true) : props.setIsModalOpen(false)
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
  return (
    <SolidColorBackgroundModal
      show={props.isModalOpen}
      onDismiss={() => {
        props.setIsModalOpen(false);
        setIsConfirmModalOpen(false);
      }}
      content={isConfirmModalOpen ? confirmModalContent : modalContent}
    />
  )
}