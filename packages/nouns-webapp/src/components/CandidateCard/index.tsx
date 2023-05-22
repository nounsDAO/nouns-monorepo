import React from 'react';
import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import {
  PartialProposal,
  PartialProposalCandidate,
  ProposalCandidate,
  ProposalState,
} from '../../wrappers/nounsDao';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import { i18n } from '@lingui/core';
import { ClockIcon } from '@heroicons/react/solid';
import ProposalStatus from '../ProposalStatus';
import { useGetCountdownCopy } from '../../hooks/useGetCountDownCopy';
import { useBlockNumber } from '@usedapp/core';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { isMobileScreen } from '../../utils/isMobile';
import CandidateSponsors from './CandidateSponsors';
import ShortAddress from '../ShortAddress';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { buildEtherscanAddressLink } from '../../utils/etherscan';

type Props = {
  candidate: PartialProposalCandidate;
  nounsRequired: number;
};

function CandidateCard({ candidate, nounsRequired }: Props) {
  const currentBlock = useBlockNumber();
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const minSponsorCount = 5;

  const countdownPill = (
    <div className={classes.proposalStatusWrapper}>
      <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
        <div className={classes.countdownPillContentWrapper}>
          <span className={classes.countdownPillClock}>
            <ClockIcon height={16} width={16} />
          </span>{' '}
          {/* <span className={classes.countdownPillText}>{countDownCopy}</span> */}
        </div>
      </div>
    </div>
  );
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
