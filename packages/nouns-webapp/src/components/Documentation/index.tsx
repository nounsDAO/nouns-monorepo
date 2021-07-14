import Section from '../Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';

const Documentation = () => {
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.wrapper}>
          <h1>What is this?</h1>
          <p>
            Nouns are an experimental attempt to improve the formation of on-chain avatar
            communities. While projects such as Cryptopunks have attempted to bootstrap digital
            community and identity, Nouns attempt to bootstrap identity, community, governance and a
            treasury that can be used by the community for the creation of long-term value.
            Additionally, nouns attempt to significantly slow community formation to ensure
            continuous community growth over time and to incentivize long-term thinking
          </p>
        </div>
      </Col>
    </Section>
  );
};
export default Documentation;
