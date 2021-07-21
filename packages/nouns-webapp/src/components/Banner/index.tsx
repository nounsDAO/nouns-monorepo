import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import panelAnimation from '../../assets/panel-animation2.gif';
import Image from 'react-bootstrap/Image';

const Banner = () => {
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            ONE NOUN,
            <br />
            EVERY DAY,
            <br />
            FOREVER.
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <Image className={classes.nounGif} src={panelAnimation} fluid />
      </Col>
    </Section>
  );
};

export default Banner;
