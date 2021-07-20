import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import panelAnimation from '../../assets/panel-animation.gif'
import Image from 'react-bootstrap/Image'

const Banner = () => {
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 6}}>
      <Image src={panelAnimation} fluid />
      </Col>
      <Col lg={{ span: 6}}>
        <div className={classes.wrapper}>
          <h1>ONE NOUN,</h1>
          <h1>EVERY DAY,</h1>
          <h1>FOREVER.</h1>
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
