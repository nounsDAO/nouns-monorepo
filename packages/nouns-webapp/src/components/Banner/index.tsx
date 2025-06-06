import { Trans } from '@lingui/react/macro';
import { Col } from 'react-bootstrap';

import calendar_noun from '@/assets/calendar_noun.png';
import LegacyNoun from '@/components/LegacyNoun';
import Section from '@/layout/Section';

import classes from './Banner.module.css';

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
          <LegacyNoun imgPath={calendar_noun} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
