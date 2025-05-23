import { Trans } from '@lingui/react/macro';
import { Col, Image } from 'react-bootstrap';

import _404img from '../../assets/404noun.png';
import Section from '../../layout/Section';

import classes from './NotFound.module.css';

const NotFoundPage = () => {
  return (
    <Section fullWidth={false}>
      <Col lg={4}>
        <Image src={_404img} fluid />
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
