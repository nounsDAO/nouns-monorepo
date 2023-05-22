import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import { PartialProposalCandidate } from '../../wrappers/nounsData';
import CandidateSponsors from './CandidateSponsors';
import ShortAddress from '../ShortAddress';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { buildEtherscanAddressLink } from '../../utils/etherscan';

type Props = {
  candidate: PartialProposalCandidate;
  nounsRequired: number;
};

function CandidateCard({ candidate, nounsRequired }: Props) {
  return (
    <Link
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      to={`/candidates/${candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{candidate.latestVersion.title}</span>
        </span>
        <p className={classes.proposer}>
          by{' '}
          <a
            href={buildEtherscanAddressLink(candidate.proposer || '')}
            target="_blank"
            rel="noreferrer"
          >
            <ShortAddress address={candidate.proposer || ''} avatar={false} />
          </a>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors
              signers={candidate.latestVersion.versionSignatures}
              nounsRequired={nounsRequired}
            />
            <span className={classes.sponsorCount}>
              <strong>
                {candidate.latestVersion.versionSignatures.length} / {nounsRequired}
              </strong>{' '}
              <Trans>sponsors</Trans>
            </span>
          </div>
          <p className={classes.timestamp}>
            {dayjs.unix(candidate.lastUpdatedTimestamp).fromNow()}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CandidateCard;
