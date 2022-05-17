import classes from './DynamicQuorumInfoModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Proposal } from '../../wrappers/nounsDao';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const DynamicQuorumInfoModalOverlay: React.FC<{
  proposal: Proposal;
  againstVotesAbs: number;
  againstVotesBps: number;
  minQuorumBps: number;
  maxQuorumBps: number;
  quadraticCoefficent: number;
  linearCoefficent: number;
  offsetBps: number;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal } = props;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>
      <div className={classes.modal}>
        <div className={classes.content}>
            <h1 className={classes.title}>Dynamic Quorum</h1>

            <p style={{
                fontWeight: '500',
                color: 'var(--brand-gray-light-text)',
                marginBottom: '-0.25rem'
            }}><Trans>The <span style={{fontWeight: 'bold'}}>Quorum</span> is the number of yes votes required to pass a propsal. This number is set as a function of the % of Nouns¹ voting <span style={{fontWeight: 'bold'}}>Against</span> a given proposal. A higher % of Nouns voting no means a higher % of Nouns must vote <span style={{fontWeight: 'bold'}}>For</span> a proposal for it to pass.</Trans></p>
            <p style={{ fontWeight: '500'}}>The number of <span style={{fontWeight: 'bold'}}>For</span> votes required to pass <span style={{fontWeight: 'bold'}}>Proposal {proposal.id}</span> is <span style={{fontWeight: 'bold'}}>$NUMBER</span> given by the following curve:</p>

            {/* Main curve content area */}
            <div>
                content goes here
            </div>

            <p style={{opacity:'50%', fontSize: '14px', fontWeight: 'normal'}}>¹ The % of Nouns is not the current number of Nouns, but the number of Nouns eligible to vote as of <span style={{fontWeight: '500'}}>block {proposal.startBlock}</span></p>




        </div>
      </div>
    </>
  );
};

const DynamicQuorumInfoModal: React.FC<{
  proposal: Proposal;
  againstVotesAbs: number;
  againstVotesBps: number;
  minQuorumBps: number;
  maxQuorumBps: number;
  quadraticCoefficent: number;
  linearCoefficent: number;
  offsetBps: number;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DynamicQuorumInfoModalOverlay
        againstVotesAbs={30}
        againstVotesBps={1000}
        minQuorumBps={1000}
        maxQuorumBps={2000}
        quadraticCoefficent={.0005}
        linearCoefficent={.01}
        offsetBps={250}
        onDismiss={onDismiss} proposal={proposal} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;