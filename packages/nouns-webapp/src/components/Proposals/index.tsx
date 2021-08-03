import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  if (!proposals?.length) {
    return (
      <Alert variant="secondary">
        <Alert.Heading>No proposals found.</Alert.Heading>
        <p>Proposals submitted by community members will appear here.</p>
      </Alert>
    );
  }

  return (
    <div className={classes.proposals}>
      {proposals.slice(0).reverse().map((p, i) => {
        return (
          <Button variant="dark" as={Link} to={`/vote/${p.id}`} key={i}>
            <span>{p.id}.</span>{' '}
            <span>{p.title}</span>{' '}
            <ProposalStatus status={p.status}></ProposalStatus>
          </Button>
        );
      })}
    </div>
  );
};

export default Proposals;
