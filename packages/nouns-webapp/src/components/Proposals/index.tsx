import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  return (
    <div className={classes.proposals}>
      <div>
        <h3 className={classes.heading}>Proposals</h3>
        <Button
          variant="success"
          className={classes.createProposalLink}
          onClick={() => history.push('create-proposal')}
        >
          Create Proposal
        </Button>
      </div>
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            return (
              <Button
                className={classes.proposalLink}
                variant="dark"
                onClick={() => history.push(`vote/${p.id}`)}
                key={i}
              >
                <span>
                  <span>{p.id}.</span> <span>{p.title}</span>
                </span>
                <ProposalStatus status={p.status}></ProposalStatus>
              </Button>
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
