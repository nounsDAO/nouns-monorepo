import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import pNounsGrid from '../../assets/pNouns_grid-4x2.png';
import Noun from '../Noun';
import { Trans } from '@lingui/macro';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1 style={{fontSize: '80px'}}>
            <Trans>1 PUBLIC NOUN,</Trans>
            <br />
            <Trans>EVERY 12 HOURS,</Trans>
            <br />
            <Trans>FOREVER.</Trans>
          </h1>
        </div>
      </Col>
      <Col lg={6} className={classes.wrapper}>
        <div style={{ padding: '2rem' }}>
          <Noun imgPath={pNounsGrid} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
