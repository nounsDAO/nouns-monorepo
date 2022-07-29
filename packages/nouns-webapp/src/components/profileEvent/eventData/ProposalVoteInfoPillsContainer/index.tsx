import React from 'react';
import { useProposalStatus } from '../../../../hooks/useProposalStatus';
import { Proposal } from '../../../../wrappers/nounsDao';
import ProposalStatusCopy from '../../../ProposalStatusCopy';
import VoteStatusPill from '../../../VoteStatusPill';
import DelegatePill from '../infoPills/DelegatePill';
import classes from './ProposalVoteInfoPills.module.css';

interface ProposalVoteInfoPillsContainerProps {
  proposal: Proposal;
  voter: string | undefined;
}

const ProposalVoteInfoPillsContainer: React.FC<ProposalVoteInfoPillsContainerProps> = props => {
  const { proposal, voter } = props;

  const proposalStatus = useProposalStatus(proposal);

  return (
    <div className={classes.wrapper}>
      {voter && <DelegatePill proposalId={proposal.id as string} address={voter} />}
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
