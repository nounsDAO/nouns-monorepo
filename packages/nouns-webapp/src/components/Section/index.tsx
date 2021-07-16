import classes from './Section.module.css';
import { Container, Row } from 'react-bootstrap';

const Section: React.FC<{ bgColor: string; fullWidth: boolean }> = props => {
  return (
    <div className={classes.container} style={{ backgroundColor: props.bgColor }}>
      <Container fluid={props.fullWidth ? true : 'lg'}>
        <Row>{props.children}</Row>
      </Container>
    </div>
  );
};
export default Section;
