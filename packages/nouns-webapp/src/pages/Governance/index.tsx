import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Noun' : 'Nouns'}`;

  return (
    <Section fullWidth={true}>
      <Col lg={{ span: 8, offset: 2 }}>
        <Row className={classes.headerRow}>
          <span>Governance</span>
          <h1>Nouns DAO</h1>
        </Row>
        <p className={classes.subheading}>
          Nouns govern <span className={classes.boldText}>NounsDAO</span>. Nouns can vote on proposals or delegate their vote to a third
          party. A minimum of <span className={classes.boldText}>{nounThresholdCopy}</span> is required to submit proposals.
        </p>

        <div style={{
          marginBottom: '3rem',
          borderRadius: '20px',
          border: '1px solid #E2E3E8'
        }}>
          <Row>
            <Col lg={9} style={{
                borderRight: '1px solid #E2E3E8',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                paddingLeft: '2rem',
                paddingRight: '2rem'
              }}>
                <Row className={classes.headerRow}>
                  <span>Treasury</span>
                </Row>
                <Row>
                    <Col className={classes.headerRow} lg={3} style={{
                      borderRight: '1px solid #E2E3E8'
                    }}>
                      <h1>Ξ 1234</h1>
                    </Col>
                    <Col>
                      <h1>$ 25,000,000</h1>
                    </Col>
                </Row>
            </Col>
            <Col style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              fontFamily: 'PT Root UI'
            }}>
              This treasury exists for <span className={classes.boldText}>NounsDAO</span> participants to allocate resources
              for the long-term growth and
              prosperity of the Nouns project.
            </Col>
          </Row>
        </div>

        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
