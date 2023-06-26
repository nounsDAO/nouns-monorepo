import classes from './DelegationCandidateVoteCountInfo.module.css';
import { Trans } from '@lingui/macro';
import React from 'react';
import BrandSpinner from '../BrandSpinner';

interface DelegationCandidateVoteCountInfoProps {
  text: React.ReactNode;
  voteCount: number;
  isLoading: boolean;
}

const DelegationCandidateVoteCountInfo: React.FC<DelegationCandidateVoteCountInfoProps> = props => {
  const { text, voteCount, isLoading } = props;

  return (
    <div className={classes.wrapper}>
      {isLoading && (
        <div className={classes.spinner}>
          <BrandSpinner />
        </div>
      )}
      <div className={classes.voteInfoWrapper}>
        <div>{text}</div>
        <div className={classes.voteCount}>
          {voteCount === 1 ? <Trans>{voteCount} Vote</Trans> : <Trans>{voteCount} Votes</Trans>}
        </div>
      </div>
    </div>
  );
};

export default DelegationCandidateVoteCountInfo;
