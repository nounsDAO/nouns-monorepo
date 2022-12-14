import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
// import calendar_noun from '../../assets/calendar_noun.png';
// import Noun from '../Noun';
import { Trans } from '@lingui/macro';
import BostonDAOLogo from '../../components/BostonDAOLogo';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            <Trans>
              <blockquote>
                “[The People] should never rise without doing something to be remembered – something
                notable. And striking.”
              </blockquote>
              <br />- John Adams
            </Trans>
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <BostonDAOLogo />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
