import { Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals } from '../../wrappers/nounsDao';
import { useUserDelegatee, useUserVotes } from '../../wrappers/nounToken';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals, loading: proposalsLoading } = useAllProposals();
  const availableVotes = useUserVotes();
  const userDelegatee = useUserDelegatee();

  return (
    <Section bgColor="white" fullWidth={true}>
      <Col lg={{ span: 8, offset: 2 }}>
        <h1 className={classes.heading}>Nouns DAO Governance</h1>
        <h2 className={classes.subheading}>
          NOUNs represent voting shares in Nouns DAO governance. You can vote on each proposal yourself or
          delegate your votes to a third party.
        </h2>
        <Proposals proposals={proposals} />
        <p>A minimum threshold of 5% of the total NOUN supply is required to submit proposals</p>
      </Col>
    </Section>
  );
}
export default GovernancePage;
