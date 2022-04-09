import classes from './BidHistoryModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid';
import { Auction } from '../../wrappers/nounsAuction';
import { StandaloneNounRoundedCorners } from '../StandaloneNoun';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { useShortAddress } from '../ShortAddress';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { Bid } from '../../utils/types';
import clsx from 'clsx';
import auctionActivityClasses from '../AuctionActivity/BidHistory.module.css';
import _trophy from '../../assets/icons/trophy.svg';
import Davatar from '@davatar/react';
import { useEthers } from '@usedapp/core';
import { useReverseENSLookUp } from '../../utils/ensLookup';

interface BidHistoryRowProps {
  bid: Bid;
  index: number;
}

const BidHistoryRow: React.FC<BidHistoryRowProps> = props => {
  const { bid, index } = props;
  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const { library: provider } = useEthers();

  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;
  const date = `${dayjs(bid.timestamp.toNumber() * 1000).format('MMM DD')} at ${dayjs(
    bid.timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  const ens = useReverseENSLookUp(bid.sender);
  const shortAddress = useShortAddress(bid.sender);

  return (
    <li
      className={clsx(auctionActivityClasses.bidRowCool, classes.bidRow)}
    >
      <div className={auctionActivityClasses.bidItem}>
        <div className={auctionActivityClasses.leftSectionWrapper}>
          <div className={auctionActivityClasses.bidder}>
            <div
            className={classes.bidderInfoWrapper}
            >
              <Davatar size={40} address={bid.sender} provider={provider} />
              <div
                className={classes.bidderInfoText}
              >
                <span>
                  {ens ? ens : shortAddress}
                  <br />
                  <div
                    className={classes.bidDate}
                  >
                    {date}
                  </div>
                </span>
              </div>

              {index === 0 && (
                <div className={classes.trophy}>
                  <img src={_trophy} alt="Winning bidder" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={auctionActivityClasses.rightSectionWrapper}>
          <div className={auctionActivityClasses.bidAmount}>{bidAmount}</div>
          <div className={auctionActivityClasses.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <div className={classes.linkIcon}>
                  <ExternalLinkIcon height={24} width={24}/>
              </div>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const BidHistoryModalOverlay: React.FC<{
  auction: Auction;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, auction } = props;

  const bids = useAuctionBids(auction.nounId);

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div className={classes.nounWrapper}>
              <StandaloneNounRoundedCorners nounId={auction && auction.nounId} />
            </div>

            <div className={classes.title}>
              <h2>Bids for</h2>
              <h1>Noun {auction && auction.nounId.toString()}</h1>
            </div>
          </div>
          <div className={classes.bidWrapper}>
            <ul>
              {bids?.map((bid: Bid, i: number) => {
                return <BidHistoryRow index={i} bid={bid} />;
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const BidHistoryModal: React.FC<{
  auction: Auction;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, auction } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <BidHistoryModalOverlay onDismiss={onDismiss} auction={auction} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default BidHistoryModal;
