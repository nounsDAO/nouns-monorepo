import classes from './AuctionActivityWrapper.module.css';

const AuctionActivityWrapper: React.FC<{ children: React.ReactNode }> = props => {
  return <div className={classes.wrapper}>{props.children}</div>;
};
export default AuctionActivityWrapper;
