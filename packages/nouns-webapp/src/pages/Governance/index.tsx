import { Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();

  return (
    <Section bgColor="transparent" fullWidth={true}>
      <Col lg={{ span: 8, offset: 2 }}>
        <h1 className={classes.heading}>Nouns DAO Governance</h1>
        <h2 className={classes.subheading}>
          Nouns govern NounsDAO.. You can vote on each proposal yourself or delegate your votes to a
          third party.
        </h2>
        <Proposals proposals={proposals} />
        <p>A minimum threshold of 5% of the total NOUN supply is required to submit proposals</p>
      </Col>
    </Section>
  );
};
export default GovernancePage;
