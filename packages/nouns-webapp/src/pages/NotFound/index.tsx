import { Col, Image } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './NotFound.module.css';
import punk from '../../assets/punk.png';
import { Trans } from '@lingui/macro';

const NotFoundPage = () => {
  return (
    <Section fullWidth={false}>
      <Col lg={4}>
        <Image src={punk} fluid />
      </Col>
      <Col lg={8}>
        <h1 className={classes.heading}>
          <Trans>404: This is not the person, place, or thing you're looking for...</Trans>
        </h1>
      </Col>
    </Section>
  );
};
export default NotFoundPage;
