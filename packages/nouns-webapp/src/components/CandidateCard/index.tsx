import React from 'react';
import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import { PartialProposal, ProposalState } from '../../wrappers/nounsDao';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import { i18n } from '@lingui/core';
import { ClockIcon } from '@heroicons/react/solid';
import ProposalStatus from '../ProposalStatus';
import { useGetCountdownCopy } from '../../hooks/useGetCountDownCopy';
import { useBlockNumber } from '@usedapp/core';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { isMobileScreen } from '../../utils/isMobile';
import CandidateSponsors from './CandidateSponsors';
import { Trans } from '@lingui/macro';

type Props = {
  candidate: PartialProposal;
};

// temporary hard-coded list of candidate sponsors
const candidateSponsorsList: `0x${string}`[] = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
];

function CandidateCard({ candidate }: Props) {
  const currentBlock = useBlockNumber();
  const isMobile = isMobileScreen();
  const activeLocale = useActiveLocale();
  const minSponsorCount = 5;

  const countDownCopy = useGetCountdownCopy(candidate, currentBlock || 0, activeLocale);
  const isPropInStateToHaveCountDown =
    candidate.status === ProposalState.PENDING ||
    candidate.status === ProposalState.ACTIVE ||
    candidate.status === ProposalState.QUEUED;

  const countdownPill = (
    <div className={classes.proposalStatusWrapper}>
      <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
        <div className={classes.countdownPillContentWrapper}>
          <span className={classes.countdownPillClock}>
            <ClockIcon height={16} width={16} />
          </span>{' '}
          <span className={classes.countdownPillText}>{countDownCopy}</span>
        </div>
      </div>
    </div>
  );
  return (
    <a
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      href={`/vote/${candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{candidate.title}</span>
        </span>
        <p>
          by <a href="">[candidate.proposer]</a>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors sponsors={candidateSponsorsList} />
            <span className={classes.sponsorCount}>
              <strong>
                {candidateSponsorsList.length}/ {minSponsorCount}{' '}
              </strong>{' '}
              <Trans>sponsors</Trans>
            </span>
          </div>
          <div>[x days left]</div>
        </div>
        {/* {isPropInStateToHaveCountDown && (
          <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
        )}
        <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
          <ProposalStatus status={candidate.status}></ProposalStatus>
        </div> */}
      </div>

      {isPropInStateToHaveCountDown && (
        <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
      )}
    </a>
  );
}

export default CandidateCard;
