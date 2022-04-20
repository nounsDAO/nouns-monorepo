import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { Trans } from "@lingui/macro";
import { i18n } from "@lingui/core";

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return <Trans>You have no Votes.</Trans>;
    }
    return <Trans>Connect wallet to make a proposal.</Trans>;
  };

  return (
    <div className={classes.proposals}>
      <div>
        <h3 className={classes.heading}>
          <Trans>
          Proposals
          </Trans>
        </h3>
        {account !== undefined && connectedAccountNounVotes > 0 ? (
          <div className={classes.submitProposalButtonWrapper}>
            <Button className={classes.generateBtn} onClick={() => history.push('create-proposal')}>
              <Trans>
              Submit Proposal
              </Trans>
            </Button>
          </div>
        ) : (
          <div className={clsx('d-flex', classes.submitProposalButtonWrapper)}>
            {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
            <div className={classes.nullBtnWrapper}>
              <Button className={classes.generateBtnDisabled}>
                <Trans>
                Submit Proposal
                </Trans>
              </Button>
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
            return (
              <div
                className={classes.proposalLink}
                onClick={() => history.push(`/vote/${p.id}`)}
                key={i}
              >
                <span className={classes.proposalTitle}>
                  <span className={classes.proposalId}>{i18n.number(parseInt(p.id || "0"))}</span> <span>{p.title}</span>
                </span>
                <div className={classes.proposalStatusWrapper}>
                  <ProposalStatus status={p.status}></ProposalStatus>
                </div>
              </div>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading><Trans>No proposals found</Trans></Alert.Heading>
          <p>
          <Trans>
            Proposals submitted by community members will appear here.
          </Trans>
          </p>
        </Alert>
      )}
    </div>
  );
};
export default Proposals;
