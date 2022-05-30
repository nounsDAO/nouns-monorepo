import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import BrandSpinner from '../BrandSpinner';
import classes from './DelegationCandidateVoteCountInfoProps.module.css';

interface DelegationCandidateVoteCountInfoProps {
  text: React.ReactNode;
  voteCount: number;
  isLoading: boolean;
}

const DelegationCandidateVoteCountInfo: React.FC<DelegationCandidateVoteCountInfoProps> = props => {
  const { text, voteCount, isLoading } = props;

  return (
    <div style={{ display: 'flex' }}>
      {isLoading &&
        <div style={{marginRight: '0.5rem'}}>
          <BrandSpinner />
        </div>
      }
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'normal',
          color: 'var(--grand-gray-ligh-text)',
          textAlign: 'right',
        }}
      >
        <div>{text}</div>
        <div style={{ color: 'black', fontWeight: 'bold' }}>
          {voteCount === 1 ? <Trans>{voteCount} Vote</Trans> : <Trans>{voteCount} Votes</Trans>}
        </div>
      </div>
    </div>
  );
};

export default DelegationCandidateVoteCountInfo;
