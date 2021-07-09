import { Col } from 'react-bootstrap';
import classes from './Lens.module.css';

const Lens: React.FC<{ zIndex: number }> = props => {
  return (
    <Col lg={4}>
      <div className={classes['lens-wrapper']} style={{ zIndex: props.zIndex }}>
        {props.children}
      </div>
    </Col>
  );
};

export default Lens;
