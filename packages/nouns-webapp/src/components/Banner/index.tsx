import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';

const Banner = () => {
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
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
