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
import ShortAddress from '../ShortAddress';
import React from 'react';
import ReactTooltip from 'react-tooltip';

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
    return <Trans>Voted against</Trans>;
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {vote && vote.voter && (
            <div
              className={classes.voteStatusWrapper}
              style={{
                marginRight: '0.5rem',
              }}
            >
              <ReactTooltip
                id={'noun-profile-delegate'}
                effect={'solid'}
                className={classes.delegateHover}
                getContent={dataTip => {
                  return <div>{dataTip}</div>;
                }}
              />
              <div
                data-tip={`Delegate for Proposal ${vote.proposal.id}`}
                data-for="noun-profile-delegate"
                style={{
                  borderRadius: '8px',
                  padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                  backgroundColor: 'var(--brand-gray-light-text-translucent)',
                  color: 'var(--brand-gray-light-text)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  display: 'flex',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    height: '16px',
                    width: '16px',
                    marginRight: '0.3rem',
                    marginTop: '0.12rem',
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
                <ShortAddress address={vote.voter.id} />
              </div>
            </div>
          )}
          <div className={classes.voteStatusWrapper}>
            <div className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default NounProfileVoteRow;
