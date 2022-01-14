import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';

const Proposals = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  // TODO get wallet connected state and noun balance of addr
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      <div style={{
        fontFamily: 'PT Root UI'
      }}>
        You must have at least 1 Noun to submit a proposal
      </div>
    </Tooltip>
  );

  return (
    <div className={classes.proposals}>
      <div>
        <h3 className={classes.heading}>Proposals</h3>
        <OverlayTrigger
          placement="top"
          delay={{ show: 0, hide: 0 }}
          overlay={renderTooltip}
        >
          <Button
            className={classes.generateBtn}
            onClick={() => history.push('create-proposal')}
          >
            Submit Proposal
          </Button>
        </OverlayTrigger>
      </div>
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
                <span>
                  <span style={{color: '#8C8D92', marginRight: '.5rem'}}>{p.id}</span> <span>{p.title}</span>
                </span>
                <ProposalStatus status={p.status}></ProposalStatus>
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
