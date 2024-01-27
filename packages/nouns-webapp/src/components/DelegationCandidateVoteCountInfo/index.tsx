import classes from './DelegationCandidateVoteCountInfo.module.css';
import React from 'react';
import BrandSpinner from '../BrandSpinner';
import {Trans} from "@lingui/macro";

interface DelegationCandidateVoteCountInfoProps {
  text: React.ReactNode;
  voteCount: number;
  isLoading: boolean;
}

const DelegationCandidateVoteCountInfo: React.FC<DelegationCandidateVoteCountInfoProps> = props => {
  const { text, voteCount, isLoading } = props;
  const vote = <Trans>Vote</Trans>
  const votes = <Trans>Votes</Trans>

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
          {voteCount === 1 ? <>{voteCount} {vote}</> : <>{voteCount} {votes}</>}
        </div>
      </div>
    </div>
  );
};

export default DelegationCandidateVoteCountInfo;
