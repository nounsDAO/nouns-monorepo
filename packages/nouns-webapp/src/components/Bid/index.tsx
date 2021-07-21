import {
  Auction,
  auctionHouseContractFactory,
  AuctionHouseContractFunctions,
} from '../../wrappers/nounsAuction';
import config from '../../config';
import { useContractFunction } from '@usedapp/core';
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { utils } from 'ethers';
import classes from './Bid.module.css';
import Modal from '../Modal';
import { Spinner } from 'react-bootstrap';

const Bid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
  minBid: number;
  useMinBid: boolean;
  onInputChange: () => void;
}> = props => {
  const { auction, auctionEnded, minBid, useMinBid, onInputChange } = props;
  const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);

  const [bidInput, setBidInput] = useState('');
  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? 'Settle' : 'Bid',
  });
  const [modal, setModal] = useState({
    show: false,
    title: 'Title',
    message: 'Some text would go here. And maybe here.',
  });
  const bidInputRef = useRef<HTMLInputElement>(null);

  const { send: placeBid, state: placeBidState } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.createBid,
  );
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.settleCurrentAndCreateNewAuction,
  );

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setBidInput(event.target.value);
    onInputChange();
  };

  const placeBidHandler = () => {
    if (!auction) {
      return;
    }
    if (!bidInputRef.current) {
      return;
    }
    if (Number(bidInputRef.current.value) < minBid) {
      return;
    } else {
      placeBid(auction.nounId, {
        value: utils.parseEther(bidInputRef.current.value.toString()),
      });
    }
  };

  const settleAuctionHandler = () => {
    settleAuction();
  };

  const dismissModalHanlder = () => {
    setModal({ ...modal, show: false });
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && placeBidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Bid',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Success':
        setModal({
          title: 'Success',
          message: `Bid was placed successfully!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        clearBidInput();
        break;
      case 'Fail':
        setModal({
          title: 'Tx Failed',
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
    }
  }, [placeBidState, auctionEnded]);

  // settle auction transaction state hook
  useEffect(() => {
    switch (auctionEnded && settleAuctionState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Settle Auction',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Success':
        setModal({
          title: 'Success',
          message: `Settled auction successfully!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
      case 'Fail':
        setModal({
          title: 'Tx Failed',
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
    }
  }, [settleAuctionState, auctionEnded]);

  return (
    <>
      {modal.show && (
        <Modal
          title={modal.title}
          content={<p>{modal.message}</p>}
          onDismiss={dismissModalHanlder}
        />
      )}
      {auction && (
        <div className={classes.bidWrapper}>
          <button
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
            disabled={placeBidState.status === 'Mining' || settleAuctionState.status === 'Mining'}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </button>
          <input
            className={auctionEnded ? classes.bidInputAuctionEnded : classes.bidInput}
            type="number"
            placeholder="ETH"
            min="0"
            value={useMinBid ? minBid.toString() : bidInput}
            onChange={bidInputHandler}
            ref={bidInputRef}
          ></input>
        </div>
      )}
    </>
  );
};
export default Bid;
