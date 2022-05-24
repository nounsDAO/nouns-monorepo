import { useQuery } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../../config';
import {
  Proposal,
  useMaxQuorumVotesBPS,
  useMinQuorumVotesBPS,
  useQuorumLinearCoefficent,
  useQuorumQuadraticCoefficient,
  useQuorumVotesBPSOffset,
} from '../../wrappers/nounsDao';
import { totalNounSupplyAtPropSnapshot } from '../../wrappers/subgraph';
import { Backdrop } from '../Modal';
import classes from './DynamicQuorumInfoModal.module.css';
import { XIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
// import { pointsPositionsCalc } from "../../utils/svgChartingUtilts";

const DynamicQuorumInfoModalOverlay: React.FC<{
  proposal: Proposal;
  againstVotesBps: number;
  minQuorumBps: number;
  maxQuorumBps: number;
  quadraticCoefficent: number;
  linearCoefficent: number;
  offsetBps: number;
  onDismiss: () => void;
}> = props => {
  const {
    onDismiss,
    proposal,
    againstVotesBps,
    minQuorumBps,
    maxQuorumBps,
    quadraticCoefficent,
    linearCoefficent,
    offsetBps,
  } = props;
  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>
      <div className={classes.modal}>
        <div className={classes.content}>
          <h1
            className={classes.title}
            style={{
              marginBottom: '-1rem',
            }}
          >
            Dynamic Quorum
          </h1>

          <p
            style={{
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            <Trans>
              The Quorum (minimum number of For votes required to pass a proposal) is set as a
              function of the number of Against votes a proposal has recieved. The number of For
              votes required to pass Proposal {proposal.id} is given by the following curve:
            </Trans>
          </p>

          {/* Outter container */}
          <div className={clsx(classes.graphContainer, classes.outterGraphContainer)}>
            <div
              style={{
                display: 'flex',
              }}
            >
              {/* Y-Axis label */}
              <div
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Trans>Required % of Nouns to Pass</Trans>
              </div>

              {/* Inner graph container */}
              <div className={clsx(classes.graphContainer, classes.innerGraphContainer)}></div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Trans>% of Nouns Currently Against</Trans>
            </div>
          </div>

          <p style={{ opacity: '50%', fontSize: '14px', fontWeight: 'normal', marginLeft: '0rem' }}>
            More details on how dynamic quorum works can be found{' '}
            <span style={{ textDecoration: 'underline' }}>here</span>.
          </p>
        </div>
      </div>
    </>
  );
};

const DynamicQuorumInfoModal: React.FC<{
  proposal: Proposal;
  againstVotesAbsolute: number;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal, againstVotesAbsolute } = props;

  const { data, loading, error } = useQuery(totalNounSupplyAtPropSnapshot(proposal.startBlock));
  const minQuorumBps = useMinQuorumVotesBPS(config.addresses.nounsDAOProxy);
  const maxQuorumBps = useMaxQuorumVotesBPS(config.addresses.nounsDAOProxy);
  const offsetBps = useQuorumVotesBPSOffset(config.addresses.nounsDAOProxy);
  const linearCoefficent = useQuorumLinearCoefficent(config.addresses.nounsDAOProxy);
  const quadraticCoefficent = useQuorumQuadraticCoefficient(config.addresses.nounsDAOProxy);

  if (error) {
    return <>Failed to fetch dynamic quorum info</>;
  }

  if (loading) {
    return <></>;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DynamicQuorumInfoModalOverlay
          // TODO IS THIS CORRECT? -- can we get this from the contract
          againstVotesBps={Math.round(againstVotesAbsolute / data.id / 10_000)}
          minQuorumBps={minQuorumBps ?? 0}
          maxQuorumBps={maxQuorumBps ?? 0}
          quadraticCoefficent={quadraticCoefficent ?? 0}
          linearCoefficent={linearCoefficent ?? 0}
          offsetBps={offsetBps ?? 0}
          onDismiss={onDismiss}
          proposal={proposal}
        />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;
