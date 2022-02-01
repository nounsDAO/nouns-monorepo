import { Proposal } from '../../wrappers/nounsDao';
import { Image } from 'react-bootstrap';
import _YesVoteIcon from '../../assets/icons/YesVote.svg';
import _NoVoteIcon from '../../assets/icons/NoVote.svg';
import _AbsentVoteIcon from '../../assets/icons/AbsentVote.svg';
import _AbstainVoteIcon from '../../assets/icons/Abstain.svg';
import { ProposalState } from '../../wrappers/nounsDao';

import classes from './NounProfileVoteRow.module.css';

import { useHistory } from 'react-router-dom';
import VoteStatusPill from '../VoteStatusPill';

import _PendingVoteIcon from '../../assets/icons/PendingVote.svg';
import { Vote } from '../../utils/vote';
import { NounVoteHistory } from '../ProfileActivityFeed';

interface NounProfileVoteRowProps {
  proposal: Proposal;
  vote?: NounVoteHistory;
}

const selectIconForNounVoteActivityRow = (proposal: Proposal, vote?: NounVoteHistory) => {
  if (!vote) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return <Image src={_PendingVoteIcon} className={classes.voteIcon} />;
    }
    return <Image src={_AbsentVoteIcon} className={classes.voteIcon} />;
  } else if (vote.supportDetailed) {
    switch (vote.supportDetailed) {
      case Vote.FOR:
        return <Image src={_YesVoteIcon} className={classes.voteIcon} />;
      case Vote.ABSTAIN:
      default:
        return <Image src={_AbstainVoteIcon} className={classes.voteIcon} />;
    }
  } else {
    return <Image src={_NoVoteIcon} className={classes.voteIcon} />;
  }
};

const selectVotingInfoText = (proposal: Proposal, vote?: NounVoteHistory) => {
  if (!vote) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return 'Waiting for';
    }
    return 'Absent for';
  } else if (vote.supportDetailed) {
    switch (vote.supportDetailed) {
      case Vote.FOR:
        return 'Voted for';
      case Vote.ABSTAIN:
      default:
        return 'Abstained on';
    }
  } else {
    return 'Voted aginst';
  }
};

const selectProposalStatusIcon = (proposal: Proposal) => {
  return (
    <VoteStatusPill status={selectProposalStatus(proposal)} text={selectProposalText(proposal)} />
  );
};

const selectProposalStatus = (proposal: Proposal) => {
  switch (proposal.status) {
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
    case ProposalState.QUEUED:
      return 'success';
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return 'failure';
    default:
      return 'pending';
  }
};

const selectProposalText = (proposal: Proposal) => {
  switch (proposal.status) {
    case ProposalState.PENDING:
      return 'Pending';
    case ProposalState.ACTIVE:
      return 'Active';
    case ProposalState.SUCCEEDED:
      return 'Succeeded';
    case ProposalState.EXECUTED:
      return 'Executed';
    case ProposalState.DEFEATED:
      return 'Defeated';
    case ProposalState.QUEUED:
      return 'Queued';
    case ProposalState.CANCELED:
      return 'Canceled';
    case ProposalState.VETOED:
      return 'Vetoed';
    case ProposalState.EXPIRED:
      return 'Expired';
    default:
      return 'Undetermined';
  }
};

const NounProfileVoteRow: React.FC<NounProfileVoteRowProps> = props => {
  const { proposal, vote } = props;

  const history = useHistory();
  const proposalOnClickHandler = () => history.push(proposal.id ? `/vote/${proposal.id}` : '/vote');

  return (
    <tr onClick={proposalOnClickHandler} className={classes.voteInfoRow}>
      <td className={classes.voteIcon}>{selectIconForNounVoteActivityRow(proposal, vote)}</td>
      <td>
        <div className={classes.voteInfoContainer}>
          {selectVotingInfoText(proposal, vote)}
          <span className={classes.proposalTitle}>{proposal.title}</span>
        </div>
      </td>
      <td>
        <div className={classes.voteStatusWrapper}>
          <div className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</div>
        </div>
      </td>
    </tr>
  );
};

export default NounProfileVoteRow;
