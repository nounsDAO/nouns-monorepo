import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import { Proposal } from '../../wrappers/nounsDao';

interface ProposalHeaderProps {
  proposal: Proposal;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, isActiveForVoting, isWalletConnected } = props;

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-start align-items-start">
        <Link to={'/vote'}>
          <button className={classes.backButton}>←</button>
        </Link>
        <div className={classes.headerRow}>
          <span>
            <div className="d-flex">
              <div>Proposal {proposal.id}</div>
              <div>
                <ProposalStatus status={proposal?.status} className={classes.proposalStatus} />
              </div>
            </div>
          </span>
          <div className={classes.proposalTitleWrapper}>
            <div className={classes.proposalTitle}>
              <h1>{proposal.title} </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end align-items-end">
        {isActiveForVoting && (
          <>
            {isWalletConnected ? (
              <></>
            ) : (
              <div className={classes.connectWalletText}>Connect a wallet to vote.</div>
            )}
            <Button
              className={isWalletConnected ? classes.submitBtn : classes.submitBtnDisabled}
              // TODO make this actually do things
              onClick={() => console.log('VOTE')}
            >
              Submit vote
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalHeader;
