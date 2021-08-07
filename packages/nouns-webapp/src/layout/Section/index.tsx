import classes from './Section.module.css';
import { Container, Row } from 'react-bootstrap';

const Section: React.FC<{ bgColor: string; fullWidth: boolean; className?: string }> = props => {
  const { bgColor, fullWidth, className, children } = props;
  return (
    <div className={`${classes.container} ${className}`} style={{ backgroundColor: bgColor }}>
      <Container fluid={fullWidth ? true : 'lg'}>
        <Row className="align-items-center">{children}</Row>
      </Container>
    </div>
  );
};
export default Section;
