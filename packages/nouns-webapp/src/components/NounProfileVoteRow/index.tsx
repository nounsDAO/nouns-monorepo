import { Proposal } from '../../wrappers/nounsDao';
import { Image } from 'react-bootstrap';
import _YesVoteIcon from '../../assets/icons/YesVote.svg';
import _NoVoteIcon from '../../assets/icons/NoVote.svg';
import _AbsentVoteIcon from '../../assets/icons/AbsentVote.svg';
import { ProposalState } from '../../wrappers/nounsDao';

import _VotePassedIcon from '../../assets/icons/VotePassed.svg';
import _VoteFailedIcon from '../../assets/icons/VoteFailed.svg';
import classes from './NounProfileVoteRow.module.css';

import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { highestNounIdMintedAtProposalTime } from '../../wrappers/subgraph';

interface NounProfileVoteRowProps {
  proposal: Proposal;
  nounVoted: boolean;
  nounSupported: boolean;
  nounId: number;
}

const selectIconForNounVoteActivityRow = (nounVoted: boolean, nounSupported: boolean) => {
  if (!nounVoted) {
    return <Image src={_AbsentVoteIcon} className={classes.voteIcon} />;
  } else if (nounSupported) {
    return <Image src={_YesVoteIcon} className={classes.voteIcon} />;
  } else {
    return <Image src={_NoVoteIcon} className={classes.voteIcon} />;
  }
};

const selectVotingInfoText = (nounVoted: boolean, nounSupported: boolean) => {
  if (!nounVoted) {
    return 'Was absent for';
  } else if (nounSupported) {
    return 'Voted for';
  } else {
    return 'Voted aginst';
  }
};

const selectProposalStatusIcon = (proposal: Proposal) => {
  switch (proposal.status) {
    case ProposalState.SUCCEEDED:
      return <Image src={_VotePassedIcon} />;
    case ProposalState.EXECUTED:
      return <Image src={_VotePassedIcon} />;
    case ProposalState.QUEUED:
      return <Image src={_VotePassedIcon} />;
    case ProposalState.DEFEATED:
      return <Image src={_VoteFailedIcon} />;
    case ProposalState.VETOED:
      return <Image src={_VoteFailedIcon} />;
    default:
      return <></>;
  }
};

// const truncateProposalText

const NounProfileVoteRow: React.FC<NounProfileVoteRowProps> = props => {
  const { proposal, nounVoted, nounSupported, nounId } = props;

  const { loading, error, data } = useQuery(highestNounIdMintedAtProposalTime(proposal.startBlock));
  const history = useHistory();

  if (loading || error) {
    return <></>;
  }

  // In this case, noun was not yet minted at time of proposal
  if (data && data.auctions.length > 0 && nounId > data.auctions[0].id) {
    if (proposal.id ===  "1") {
      return (
        <div className={classes.nullStateCopy}> 
        This Noun has no activity yet. Check back soon!
        </div>
      );
    }
    return <></>;
  }

  const proposalOnClickHandler = () => (history.push(proposal.id ? `/vote/${proposal.id}` : '/vote'));

  return (
    <tr onClick={proposalOnClickHandler} className={classes.voteInfoRow}>
      <td>
          {selectIconForNounVoteActivityRow(nounVoted, nounSupported)}
      </td>
      <td>
        <div className={classes.voteInfoContainer}>
          {selectVotingInfoText(nounVoted, nounSupported)}
          <span className={classes.proposalLink}>
            {proposal.title}
          </span>
        </div>
      </td>
      <td className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</td>
    </tr>
  );
};

export default NounProfileVoteRow;
