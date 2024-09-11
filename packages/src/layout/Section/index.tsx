import classes from './Section.module.css';
import { Container, Row } from 'react-bootstrap';
import { CSSProperties } from 'react';

const Section: React.FC<{
  fullWidth: boolean;
  className?: string;
  style?: CSSProperties;
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
