import {
  Auction,
  auctionHouseContractFactory,
  AuctionHouseContractFunctions,
} from '../../../wrappers/nounsAuction';
import config from '../../../config';
import { useContractFunction } from '@usedapp/core';
import { useState } from 'react';
import { utils } from 'ethers';
import classes from './Bid.module.css';

const Bid: React.FC<{ auction: Auction }> = props => {
  const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);
  const { send } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.createBid,
  );

  const [bid, setBid] = useState(0);

  const placeBidHandler = () => {
    send(props.auction.nounId, {
      value: utils.parseEther(bid.toString()),
    });
  };

  const bidInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bidNumber = Number(event.target.value);
    if (bidNumber > 0) {
      setBid(bidNumber);
    }
  };

  return (
    <>
      <button className={classes.bidBtn} onClick={placeBidHandler}>
        BID
      </button>
      <input
        className={classes.bidInput}
        onChange={bidInputHandler}
        type="number"
        placeholder="ETH"
        min="0"
      ></input>
    </>
  );
};
export default Bid;
