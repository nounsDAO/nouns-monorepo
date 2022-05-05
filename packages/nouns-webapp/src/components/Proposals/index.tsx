import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';


const getTruncatedTimeLeft = (proposal: Proposal) => {

};

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;

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
            return (
              <div
                className={classes.proposalLink}
                onClick={() => history.push(`/vote/${p.id}`)}
                key={i}
              >
                <span className={classes.proposalTitle}>
                  <span className={classes.proposalId}>{p.id}</span> <span>{p.title}</span>
                </span>


                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '1rem'
                  // backgroundColor: 'red'

                }}>

                  <div className={classes.proposalStatusWrapper}>
                    <div
                      className={proposalStatusClasses.proposalStatus}
                      style={{
                        backgroundColor: 'var(--brand-gray-light-text-translucent)',
                        color: '#00000080',
                        width: '9rem',
                      }}
                    >
                      <ClockIcon height={18} width={18} /> Ending in 1 hour
                    </div>
                  </div>

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
