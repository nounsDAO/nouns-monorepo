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

type Props = {
  candidate: PartialProposalCandidate;
};

// temporary hard-coded list of candidate sponsors
const candidateSponsorsList: `0x${string}`[] = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
];

function CandidateCard({ candidate }: Props) {
  console.log('candidate', candidate);
  const currentBlock = useBlockNumber();
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const minSponsorCount = 5;

  // const countDownCopy = useGetCountdownCopy(candidate, currentBlock || 0, activeLocale);
  // const isPropInStateToHaveCountDown =
  //   candidate.status === ProposalState.PENDING ||
  //   candidate.status === ProposalState.ACTIVE ||
  //   candidate.status === ProposalState.QUEUED;
  // console.log(
  //   'candidate.latestVersion.versionSignatures',
  //   candidate.latestVersion.versionSignatures,
  // );

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
          <a href="">
            <ShortAddress address={candidate.proposer} />
          </a>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors signers={candidate.latestVersion.versionSignatures} />
            <span className={classes.sponsorCount}>
              <strong>
                {candidate.latestVersion.versionSignatures.length} / {minSponsorCount}{' '}
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
