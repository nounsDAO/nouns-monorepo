import { Col } from 'react-bootstrap';
import Section from '../Section';
import classes from './Banner.module.css';

const Banner = () => {
  return (
    <Section bgColor="white">
      <Col lg={{ span: 8, offset: 2 }}>
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
