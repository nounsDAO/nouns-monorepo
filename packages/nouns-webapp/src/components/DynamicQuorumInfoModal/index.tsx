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
  return <></>;
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
