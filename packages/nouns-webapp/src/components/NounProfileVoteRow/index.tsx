import { Proposal } from "../../wrappers/nounsDao";
import { Image } from 'react-bootstrap';
import _YesVoteIcon from '../../assets/icons/YesVote.svg';
import _NoVoteIcon from '../../assets/icons/NoVote.svg';
import _AbsentVoteIcon from '../../assets/icons/AbsentVote.svg';
import { ProposalState } from '../../wrappers/nounsDao';

import _VotePassedIcon from '../../assets/icons/VotePassed.svg';
import _VoteFailedIcon from '../../assets/icons/VoteFailed.svg';

interface NounProfileVoteRowProps {
    proposal: Proposal,
    nounVoted: boolean, 
    nounSupported: boolean
}

const selectIconForNounVoteActivityRow = (nounVoted: boolean, nounSupported: boolean) => {
    if (!nounVoted) {
        return (
            <Image src={_AbsentVoteIcon} style={{
                marginRight: '10px',
            }} />
          );    } else if (nounSupported) {
      return (
        <Image src={_YesVoteIcon} style={{
            marginRight: '10px',
        }} />
      );
    } else {
        return (
            <Image src={_NoVoteIcon} style={{
                marginRight: '10px',
            }} />
          );    }
  };

  const selectVotingInfoText = (nounVoted: boolean, nounSupported: boolean) => {
    if (!nounVoted) {
      return 'Was absent for';
    } else if (nounSupported) {
      return 'Voted for'
    } else {
      return (
          'Voted aginst'
      );
    }
  };

  const createProposalStatusGem = (proposal: Proposal) => {
      switch (proposal.status) {
          case ProposalState.SUCCEEDED:
              return (
                <td style={{
                    textAlign: 'right'
                }}>
                    <Image src={_VotePassedIcon} />
                </td>
              );
           case ProposalState.EXECUTED:
                return (
                  <td style={{
                      textAlign: 'right'
                  }}>
                      <Image src={_VotePassedIcon} />
                  </td>
                );
           case ProposalState.QUEUED:
                return (
                  <td style={{
                      textAlign: 'right'
                  }}>
                      <Image src={_VotePassedIcon} />
                  </td>
                );
          case ProposalState.DEFEATED:
              return (
                <td style={{
                    textAlign: 'right'
                }}>
                    <Image src={_VoteFailedIcon} />
                </td>
              );
        case ProposalState.VETOED:
              return (
                <td style={{
                    textAlign: 'right'
                }}>
                    <Image src={_VoteFailedIcon} />
                </td>
              );
          default:
              return (
                  <td></td>
              );
      }
  };

const NounProfileVoteRow: React.FC<NounProfileVoteRowProps> = props => {

    const { proposal, nounVoted, nounSupported } = props;

    return (
        <tr>
                <td>
                    {selectIconForNounVoteActivityRow(nounVoted, nounSupported)}
                    {selectVotingInfoText(nounVoted, nounSupported)} <strong>{proposal.title}</strong>
                </td>
                {createProposalStatusGem(proposal)}
        </tr>
    )
};

export default NounProfileVoteRow;