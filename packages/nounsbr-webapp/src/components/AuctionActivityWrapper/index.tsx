import classes from './AuctionActivityWrapper.module.css';

const AuctionActivityWrapper: React.FC<{}> = props => {
  return <div className={classes.wrapper}>{props.children}</div>;
};
export default AuctionActivityWrapper;
