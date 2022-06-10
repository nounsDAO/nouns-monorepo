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
import { Trans } from '@lingui/macro';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';

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
      return <Trans>Waiting for</Trans>;
    }
    return <Trans>Absent for</Trans>;
  } else if (vote.supportDetailed) {
    switch (vote.supportDetailed) {
      case Vote.FOR:
        return <Trans>Voted for</Trans>;
      case Vote.ABSTAIN:
      default:
        return <Trans>Abstained on</Trans>;
    }
  } else {
    return <Trans>Voted aginst</Trans>;
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
      return <Trans>Pending</Trans>;
    case ProposalState.ACTIVE:
      return <Trans>Active</Trans>;
    case ProposalState.SUCCEEDED:
      return <Trans>Succeeded</Trans>;
    case ProposalState.EXECUTED:
      return <Trans>Executed</Trans>;
    case ProposalState.DEFEATED:
      return <Trans>Defeated</Trans>;
    case ProposalState.QUEUED:
      return <Trans>Queued</Trans>;
    case ProposalState.CANCELLED:
      return <Trans>Canceled</Trans>;
    case ProposalState.VETOED:
      return <Trans>Vetoed</Trans>;
    case ProposalState.EXPIRED:
      return <Trans>Expired</Trans>;
    default:
      return <Trans>Undetermined</Trans>;
  }
};

const NounProfileVoteRow: React.FC<NounProfileVoteRowProps> = props => {
  const { proposal, vote } = props;

  const history = useHistory();
  const proposalOnClickHandler = () => history.push(proposal.id ? `/vote/${proposal.id}` : '/vote');
  const activeLocale = useActiveLocale();

  return (
    <tr onClick={proposalOnClickHandler} className={classes.voteInfoRow}>
      <td className={classes.voteIcon}>{selectIconForNounVoteActivityRow(proposal, vote)}</td>
      <td className={classes.voteInfoTableCell}>
        <div className={classes.voteInfoContainer}>
          {selectVotingInfoText(proposal, vote)}
          <span className={classes.proposalTitle}>{proposal.title}</span>
        </div>
      </td>
      <td className={activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.desktopOnly : ''}>
        <div className={classes.voteStatusWrapper}>
          <div className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</div>
        </div>
      </td>
    </tr>
  );
};

export default NounProfileVoteRow;
