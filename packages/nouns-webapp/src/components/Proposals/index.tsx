import { Proposal, ProposalState } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getCountdownCopy = (proposal: Proposal, currentBlock: number) => {
  const AVERAGE_BLOCK_TIME_IN_SECS = 13;
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return `Ends ${endDate.fromNow()}`;
  }
  if (endDate?.isBefore(now)) {
    return `Expires ${expiresDate.fromNow()}`;
  }
  return `Starts ${dayjs(startDate).fromNow()} `;
};

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const currentBlock = useBlockNumber();

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no Votes.';
    }
    return 'Connect wallet to make a proposal.';
  };

  return (
    <div className={classes.proposals}>
      <div>
        <h3 className={classes.heading}>Proposals</h3>
        {account !== undefined && connectedAccountNounVotes > 0 ? (
          <div className={classes.submitProposalButtonWrapper}>
            <Button className={classes.generateBtn} onClick={() => history.push('create-proposal')}>
              Submit Proposal
            </Button>
          </div>
        ) : (
          <div className={clsx('d-flex', classes.submitProposalButtonWrapper)}>
            {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
            <div className={classes.nullBtnWrapper}>
              <Button className={classes.generateBtnDisabled}>Submit Proposal</Button>
            </div>
          </div>
        )}
      </div>
      {isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            const isPropInStateToHaveCountDown =
              p.status === ProposalState.PENDING ||
              p.status === ProposalState.ACTIVE ||
              p.status === ProposalState.SUCCEEDED ||
              p.status === ProposalState.QUEUED;
            return (
              <div
                className={clsx(
                  classes.proposalLink,
                  isPropInStateToHaveCountDown ? classes.proposalLinkWithCountdown : '',
                )}
                onClick={() => history.push(`/vote/${p.id}`)}
                key={i}
              >
                <span className={classes.proposalTitle}>
                  <span className={classes.proposalId}>{p.id}</span> <span>{p.title}</span>
                </span>

                <div
                  className={isPropInStateToHaveCountDown ? classes.proposalInfoPillsWrapper : ''}
                >
                  {isPropInStateToHaveCountDown && (
                    <div className={classes.proposalStatusWrapper}>
                      <div
                        className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}
                        // className={clsx(classes.countdownPill, proposalStatusClasses.proposalStatus)}
                      >
                        <div
                        className={classes.countdownPillContentWrapper}
                        >
                          <span
                            className={classes.countdownPillClock}
                          >
                            <ClockIcon height={16} width={16} />
                          </span>{' '}
                          <span className={classes.countdownPillText}>
                            {getCountdownCopy(p, currentBlock || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={classes.proposalStatusWrapper}>
                    <ProposalStatus status={p.status}></ProposalStatus>
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>No proposals found.</Alert.Heading>
          <p>Proposals submitted by community members will appear here.</p>
        </Alert>
      )}
    </div>
  );
};
export default Proposals;
