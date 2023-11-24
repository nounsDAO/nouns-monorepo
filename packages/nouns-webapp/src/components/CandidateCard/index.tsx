import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import { ProposalCandidate } from '../../wrappers/nounsData';
import CandidateSponsors from './CandidateSponsors';
import ShortAddress from '../ShortAddress';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { PartialProposal } from '../../wrappers/nounsDao';
import { relativeTimestamp } from '../../utils/timeUtils';

type Props = {
  candidate: ProposalCandidate;
  nounsRequired: number;
  latestProposal?: PartialProposal;
  currentBlock?: number;
};


function CandidateCard(props: Props) {
  const signers = props.candidate.version.content.contentSignatures;
  const proposerVoteCount = props.candidate.proposerVotes;

  return (
    <Link
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      to={`/candidates/${props.candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{props.candidate.version.content.title}</span>
        </span>
        <p className={classes.proposer}>
          by{' '}
          <span className={classes.proposerAddress}>
            <ShortAddress address={props.candidate.proposer || ''} avatar={false} />
          </span>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors
              signers={signers}
              nounsRequired={props.candidate.requiredVotes}
              currentBlock={props.currentBlock && props.currentBlock - 1}
              isThresholdMetByProposer={
                proposerVoteCount && proposerVoteCount >= props.candidate.requiredVotes
                  ? true
                  : false
              }
            />
            <span
              className={clsx(
                classes.sponsorCount,
                props.candidate.voteCount - props.candidate.requiredVotes > 0 &&
                classes.sponsorCountOverflow,
              )}
            >
              <strong>
                {props.candidate.voteCount} /{" "}
                {props.candidate.proposerVotes > props.nounsRequired ? (
                  <em className={classes.naVotesLabel}>n/a</em>
                ) : (
                  props.candidate.requiredVotes
                )}
              </strong>{' '}
              <Trans>sponsored votes</Trans>
            </span>
          </div>
          <p className={classes.timestamp}>
            {relativeTimestamp(props.candidate.lastUpdatedTimestamp)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CandidateCard;
