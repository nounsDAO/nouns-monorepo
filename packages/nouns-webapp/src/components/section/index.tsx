/* eslint-disable react/prop-types */
import { CSSProperties } from 'react';

import { Container, Row } from 'react-bootstrap';

import classes from './section.module.css';

const Section: React.FC<{
  fullWidth: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}> = props => {
  const { fullWidth, className, children, style } = props;
  return (
    <div className={`${classes.container} ${className}`} style={style}>
      <Container fluid={fullWidth ? true : 'lg'}>
        <Row className="align-items-center">{children}</Row>
      </Container>
    </div>
  );
};
export default Section;
