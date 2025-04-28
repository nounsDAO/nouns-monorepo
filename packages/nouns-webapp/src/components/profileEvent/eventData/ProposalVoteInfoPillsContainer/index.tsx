import React from 'react';
import { useProposalStatus } from '../../../../hooks/useProposalStatus';
import { Proposal } from '../../../../wrappers/nounsDao';
import ProposalStatusCopy from '../../../ProposalStatusCopy';
import VoteStatusPill from '../../../VoteStatusPill';
import classes from './ProposalVoteInfoPills.module.css';

interface ProposalVoteInfoPillsContainerProps {
  proposal: Proposal;
}

const ProposalVoteInfoPillsContainer: React.FC<ProposalVoteInfoPillsContainerProps> = props => {
  const { proposal } = props;

  const proposalStatus = useProposalStatus(proposal);

  return (
    <div className={classes.wrapper}>
      <div className={classes.voteStatusWrapper}>
        <div className={classes.voteProposalStatus}>
          <VoteStatusPill
            status={proposalStatus}
            text={<ProposalStatusCopy proposal={proposal} />}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalVoteInfoPillsContainer;
