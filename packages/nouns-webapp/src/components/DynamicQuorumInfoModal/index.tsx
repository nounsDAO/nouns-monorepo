import classes from './DynamicQuorumInfoModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Proposal } from '../../wrappers/nounsDao';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


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
  const labels = [0,
    33,
    67,
    100,
    133,
    167,
    200,
    233,
    267,
    300,
    333,
    367,
    400,
    433,
    467,
    500,
    533,
    567,
    600,
    633,
    667,
    700,
    733,
    767,
    800,
    833,
    867,
    900,
    933,
    967,
    1000,
    1033,
    1067,
    1100,
    1133,
    1167,
    1200,
    1233,
    1267,
    1300,
    1333,
    1367,
    1400,
    1433,
    1467,
    1500,
    1533,
    1567,
    1600,
    1633,
    1667,
    1700,
    1733,
    1767,
    1800,
    1833,
    1867,
    1900,
    1933,
    1967,
    2000,
    2033,
    2067,
    2100,
    2133,
    2167,
    2200,
    2233,
    2267,
    2300,
    2333,
    2367,
    2400,
    2433,
    2467,
    2500,
    2533,
    2567,
    2600,
    2633,
    2667,
    2700,
    2733,
    2767,
    2800,
    2833,
    2867,
    2900,
    2933,
    2967,
    3000,
    3033,
    3067,
    3100,
    3133,
    3167,
    3200,
    3233,
    3267,
    3300,
    3333,
    3367,
    3400,
    3433];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Quorum For % vs Against %',
        data: [
            1000.00,
            1000.00,
            1000.00,
            1000.00,
            1000.00,
            1000.00,
            1000.00,
            1000.00,
            1000.31,
            1001.75,
            1004.31,
            1007.97,
            1012.75,
            1018.64,
            1025.64,
            1033.75,
            1042.97,
            1053.31,
            1064.75,
            1077.31,
            1090.97,
            1105.75,
            1121.64,
            1138.64,
            1156.75,
            1175.97,
            1196.31,
            1217.75,
            1240.31,
            1263.97,
            1288.75,
            1314.64,
            1341.64,
            1369.75,
            1398.97,
            1429.31,
            1460.75,
            1493.31,
            1526.97,
            1561.75,
            1597.64,
            1634.64,
            1672.75,
            1711.97,
            1752.31,
            1793.75,
            1836.31,
            1879.97,
            1924.75,
            1970.64,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
            2000.00,
        ],
        borderColor: 'var(--brand-gray-light-text-translucen)',
        backgroundColor: 'var(--brand-gray-light-text)',
        tension: 0.2
        // backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

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

          <p
            style={{
              fontWeight: '500',
              color: 'var(--brand-gray-light-text)',
              marginBottom: '-0.25rem',
            }}
          >
            <Trans>
              The <span style={{ fontWeight: 'bold' }}>Quorum</span> is the number of yes votes
              required to pass a propsal. This number is set as a function of the % of Nouns¹ voting{' '}
              <span style={{ fontWeight: 'bold' }}>Against</span> a given proposal. A higher % of
              Nouns voting no means a higher % of Nouns must vote{' '}
              <span style={{ fontWeight: 'bold' }}>For</span> a proposal for it to pass.
            </Trans>
          </p>
          <p style={{ fontWeight: '500' }}>
            The number of <span style={{ fontWeight: 'bold' }}>For</span> votes required to pass{' '}
            <span style={{ fontWeight: 'bold' }}>Proposal {proposal.id}</span> is{' '}
            <span style={{ fontWeight: 'bold' }}>$NUMBER</span> given by the following curve:
          </p>

          {/* Main curve content area */}
          <div> 
            <Line options={options} data={data} />
          </div>

          <p style={{ opacity: '50%', fontSize: '14px', fontWeight: 'normal' }}>
            ¹ The % of Nouns is not the current number of Nouns, but the number of Nouns eligible to
            vote as of <span style={{ fontWeight: '500' }}>block {proposal.startBlock}</span>
          </p>
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
          quadraticCoefficent={0.0005}
          linearCoefficent={0.01}
          offsetBps={250}
          onDismiss={onDismiss}
          proposal={proposal}
        />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;
