import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import bannernft from '../../assets/bannernft.png';
import Noun from '../Noun';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            Chiliagon
            <br />
            DAO
            <br />
            Everyday.
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{padding: '2rem'}} > 
          <Noun imgPath={bannernft} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
