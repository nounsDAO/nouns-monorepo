import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import calendar_noun from '../../assets/calendar_noun.png';
import Noun from '../Noun';
import { Trans } from '@lingui/macro';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            <Trans>ONE NOUN,</Trans>
            <br />
            <Trans>EVERY DAY,</Trans>
            <br />
            <Trans>FOREVER.</Trans>
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <Noun imgPath={calendar_noun} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
