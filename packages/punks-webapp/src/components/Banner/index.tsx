import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import punk from '../../assets/punk.png';
import Punk from '../Punk';
import { Trans } from '@lingui/macro';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            <Trans>ONE PUNK,</Trans>
            <br />
            <Trans>EVERY DAY,</Trans>
            <br />
            <Trans>FOREVER.</Trans>
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <Punk imgPath={punk} alt="punk" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
