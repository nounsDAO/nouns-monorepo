import { Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsCopy =
    threshold !== undefined && `${threshold + 1} ${threshold === 0 ? 'Noun' : 'Nouns'}`;

  return (
    <Section fullWidth={true}>
      <Col lg={{ span: 8, offset: 2 }}>
        <h1 className={classes.heading}>Nouns DAO Governance</h1>
        {threshold !== undefined && (
          <p className={classes.subheading}>
            {`Nouns govern NounsDAO. Nouns can vote on proposals or delegate their vote to a third
            party. A minimum of ${nounsCopy} is required to submit
            proposals.`}
          </p>
        )}
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
