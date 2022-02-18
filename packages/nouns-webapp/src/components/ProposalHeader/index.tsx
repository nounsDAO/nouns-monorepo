import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import { Proposal } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';

interface ProposalHeaderProps {
  proposal: Proposal;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, isActiveForVoting, isWalletConnected } = props;

  const isMobile = isMobileScreen();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <Link to={'/vote'}>
            <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
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
        {!isMobile && (
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
        )}
      </div>

      <div className={classes.mobileSubmitProposalButton}>
        {isMobile && isActiveForVoting && (
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
    </>
  );
};

export default ProposalHeader;
