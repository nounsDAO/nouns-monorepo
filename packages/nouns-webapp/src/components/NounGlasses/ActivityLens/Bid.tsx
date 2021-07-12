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

const Bid: React.FC<{ auction: Auction; auctionEnded: boolean }> = props => {
  const { auction, auctionEnded } = props;
  const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);

  const { send: placeBid } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.createBid,
  );
  const { send: settleAuction } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.settleCurrentAndCreateNewAuction,
  );

  const [bid, setBid] = useState(0);
  const bidInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bidNumber = Number(event.target.value);
    if (bidNumber > 0) {
      setBid(bidNumber);
    }
  };

  const placeBidHandler = () => {
    placeBid(auction.nounId, {
      value: utils.parseEther(bid.toString()),
    });
  };

  const settleAuctionHandler = () => {
    settleAuction();
  };

  const buttonContent = auctionEnded ? 'SETTLE AUCTION' : 'BID';

  return (
    <>
      <button
        className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
        onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
      >
        {buttonContent}
      </button>
      <input
        className={auctionEnded ? classes.bidInputAuctionEnded : classes.bidInput}
        onChange={bidInputHandler}
        type="number"
        placeholder="ETH"
        min="0"
      ></input>
    </>
  );
};
export default Bid;
