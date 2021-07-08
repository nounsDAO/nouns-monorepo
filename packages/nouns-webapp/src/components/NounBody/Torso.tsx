import { Col } from 'react-bootstrap';
import classes from './Torso.module.css';

const Torso = () => {
  return (
    <Col lg={{ span: 9, offset: 1 }} className={classes.torso}>
      <h1>Proposal:</h1>
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>
    </Col>
  );
};
export default Torso;
