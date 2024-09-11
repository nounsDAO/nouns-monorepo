import { Col } from 'react-bootstrap';
import classes from './AuctionTitleAndNavWrapper.module.css';

const AuctionTitleAndNavWrapper: React.FC<{}> = props => {
  return (
    <Col lg={12} className={classes.auctionTitleAndNavContainer}>
      {props.children}
    </Col>
  );
};
export default AuctionTitleAndNavWrapper;
