import { Proposal } from '../../wrappers/nounsDao';
import { Image } from 'react-bootstrap';
import _YesVoteIcon from '../../assets/icons/YesVote.svg';
import _NoVoteIcon from '../../assets/icons/NoVote.svg';
import _AbsentVoteIcon from '../../assets/icons/AbsentVote.svg';
import { ProposalState } from '../../wrappers/nounsDao';

import classes from './NounProfileVoteRow.module.css';

import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { highestNounIdMintedAtProposalTime } from '../../wrappers/subgraph';
import VoteStatusPill from '../VoteStatusPill';

import _PendingVoteIcon from '../../assets/icons/PendingVote.svg';

interface NounProfileVoteRowProps {
  proposal: Proposal;
  nounVoted: boolean;
  nounSupported: boolean;
  nounId: number;
  latestProposalId: number;
}

const selectIconForNounVoteActivityRow = (
  nounVoted: boolean,
  nounSupported: boolean,
  proposal: Proposal,
) => {
  if (!nounVoted) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return <Image src={_PendingVoteIcon} className={classes.voteIcon} />;
    }
    return <Image src={_AbsentVoteIcon} className={classes.voteIcon} />;
  } else if (nounSupported) {
    return <Image src={_YesVoteIcon} className={classes.voteIcon} />;
  } else {
    return <Image src={_NoVoteIcon} className={classes.voteIcon} />;
  }
};

const selectVotingInfoText = (nounVoted: boolean, nounSupported: boolean, proposal: Proposal) => {
  if (!nounVoted) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return 'Waiting for';
    }
    return 'Absent for';
  } else if (nounSupported) {
    return 'Voted for';
  } else {
    return 'Voted aginst';
  }
};

const selectProposalStatusIcon = (proposal: Proposal) => {
  switch (proposal.status) {
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
    case ProposalState.QUEUED:
      return <VoteStatusPill status={'success'} />;
    case ProposalState.DEFEATED:
    case ProposalState.VETOED:
      return <VoteStatusPill status={'failure'} />;
    default:
      return <VoteStatusPill status={'pending'} />;
  }
};

const NounProfileVoteRow: React.FC<NounProfileVoteRowProps> = props => {
  const { proposal, nounVoted, nounSupported, nounId, latestProposalId } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery(highestNounIdMintedAtProposalTime(proposal.startBlock));
  const history = useHistory();

  if (loading) {
    return <></>;
  }

  // In this case, noun was not yet minted at time of proposal
  if (data && data.auctions.length > 0 && nounId > data.auctions[0].id) {
    if (proposal.id === latestProposalId.toString()) {
      return (
        <tr className={classes.nullStateCopy}>This Noun has no activity yet. Check back soon!</tr>
      );
    }
    return <></>;
  }

  const proposalOnClickHandler = () => history.push(proposal.id ? `/vote/${proposal.id}` : '/vote');

  return (
    <tr onClick={proposalOnClickHandler} className={classes.voteInfoRow}>
      <td className={classes.voteIcon}>
        {selectIconForNounVoteActivityRow(nounVoted, nounSupported, proposal)}
      </td>
      <td>
        <div className={classes.voteInfoContainer}>
          {selectVotingInfoText(nounVoted, nounSupported, proposal)}
          <span className={classes.proposalTitle}>{proposal.title}</span>
        </div>
      </td>
      <td className={classes.voteStatusWrapper}>
        <div className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</div>
      </td>
    </tr>
  );
};

export default NounProfileVoteRow;
