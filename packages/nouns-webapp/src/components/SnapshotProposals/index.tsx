import { ProposalState, SnapshotProposal } from '../../wrappers/nounsDao';
import { Alert } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './SnapshotProposals.module.css';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE, SupportedLocale } from '../../i18n/locales';
import en from 'dayjs/locale/en';

dayjs.extend(relativeTime);

const getCountdownCopy = (proposal: SnapshotProposal, locale: SupportedLocale) => {
  const startDate = dayjs(proposal.startDateMs);
  const endDate = dayjs(proposal.endDateMs);
  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return (
      <Trans>
        Ends {endDate.locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en).fromNow()}
      </Trans>
    );
  }
  return (
    <Trans>
      Starts{' '}
      {dayjs(startDate)
        .locale(SUPPORTED_LOCALE_TO_DAYSJS_LOCALE[locale] || en)
        .fromNow()}
    </Trans>
  );
};

const SnapshotProposals = ({ proposals }: { proposals: SnapshotProposal[] }) => {
  const activeLocale = useActiveLocale();

  return (
    <div className={classes.proposals}>
      <div className={classes.headerWrapper} style={{ marginBottom: '1 rem' }}>
        <h3 className={classes.heading}>
          <Trans>Offchain Proposals</Trans>
        </h3>
      </div>
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            const isPropInStateToHaveCountDown =
              p.status === ProposalState.PENDING ||
              p.status === ProposalState.ACTIVE ||
              p.status === ProposalState.QUEUED;

            const countdownPill = (
              <div className={classes.proposalStatusWrapper}>
                <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
                  <div className={classes.countdownPillContentWrapper}>
                    <span className={classes.countdownPillClock}>
                      <ClockIcon height={16} width={16} />
                    </span>{' '}
                    <span className={classes.countdownPillText}>
                      {getCountdownCopy(p, activeLocale)}
                    </span>
                  </div>
                </div>
              </div>
            );

            return (
              <a
                className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                href={`https://snapshot.org/#/nouns.eth/proposal/${p.id}`}
                target="_blank"
                rel="noreferrer"
                key={i}
              >
                <div className={classes.proposalInfoWrapper}>
                  <span className={classes.proposalTitle}>
                    <span className={classes.proposalId}>⚡</span> <span>{p.title}</span>
                  </span>

                  {isPropInStateToHaveCountDown && (
                    <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                  )}
                  <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                    <ProposalStatus status={p.status}></ProposalStatus>
                  </div>
                </div>

                {isPropInStateToHaveCountDown && (
                  <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                )}
              </a>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>
            <Trans>No proposals found</Trans>
          </Alert.Heading>
          <p>
            <Trans>Proposals submitted by community members will appear here.</Trans>
          </p>
        </Alert>
      )}
    </div>
  );
};
export default SnapshotProposals;
