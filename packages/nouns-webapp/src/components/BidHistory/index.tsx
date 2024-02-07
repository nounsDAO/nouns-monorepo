import React, { useState } from 'react';
import ShortAddress from '../ShortAddress';
import dayjs from 'dayjs';
import link from '../../assets/icons/Link.svg';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { Bid } from '../../utils/types';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { useAppSelector } from '../../hooks';
import CommentModal from '../CommentModal';
import TruncatedComment from '../TruncatedComment';

const bidItem = (
  bid: Bid,
  index: number,
  classes: any,
  showBids: boolean,
  onClickHandler: (index: number) => void,
  isCool?: boolean,
) => {
  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;
  const date = `${dayjs(bid.timestamp.toNumber() * 1000).format('MMM DD')} at ${dayjs(
    bid.timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const isMobile = window.innerWidth < 992;

  const CommentBlock = () => (
    <div className={classes.bidComment} onClick={() => onClickHandler(index)}>
      {bid.comment ? <TruncatedComment comment={bid.comment} /> : null}
    </div>
  );

  return (
    <>
      <li key={index} className={isCool ? classes.bidRowCool : classes.bidRowWarm}>
        <div className={classes.bidItem}>
          <div className={classes.leftSectionWrapper}>
            <div className={classes.bidder}>
              <div>
                <ShortAddress address={bid.sender} avatar={isMobile ? false : true} />
              </div>
            </div>
            <div className={classes.bidDate}>{date}</div>
          </div>
          <div className={classes.bidItemRightSectionWrapper}>
            {showBids ? (
              <>
                <div className={classes.bidAmount}>{bidAmount}</div>
                <div className={classes.linkSymbol}>
                  <a href={txLink} target="_blank" rel="noreferrer">
                    <img src={link} width={24} alt="link symbol" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <CommentBlock />
              </>
            )}
          </div>
        </div>
      </li>
    </>
  );
};

const BidHistory: React.FC<{
  auctionId: string;
  max: number;
  showBids: boolean;
  classes?: any;
}> = props => {
  const { auctionId, max, showBids, classes } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const bids = useAuctionBids(EthersBN.from(auctionId));
  const sortedBids =
    bids &&
    bids
      .sort((bid1: Bid, bid2: Bid) => -1 * (bid1.timestamp.toNumber() - bid2.timestamp.toNumber()))
      .slice(0, max);

  const [showBidModal, setShowBidModal] = useState(false);
  const [bid, setBid] = useState<Bid | undefined>();

  const showBidModalHandler = (index: number) => {
    setShowBidModal(true);
    sortedBids && setBid(sortedBids[index]);
  };

  const dismissBidModalHandler = () => {
    setShowBidModal(false);
  };

  const bidContent =
    bids &&
    bids
      .sort((bid1: Bid, bid2: Bid) => -1 * (bid1.timestamp.toNumber() - bid2.timestamp.toNumber()))
      .map((bid: Bid, i: number) => {
        return bidItem(bid, i, classes, showBids, () => showBidModalHandler(i), isCool);
      })
      .slice(0, max);

  return (
    <>
      {showBidModal && bid && (
        <CommentModal
          onDismiss={dismissBidModalHandler}
          bidder={bid.sender}
          comment={bid.comment ?? ''}
          nounId={bid.nounId}
          amount={bid.value}
          timestamp={bid.timestamp}
        />
      )}

      <ul className={classes.bidCollection}>{bidContent}</ul>
    </>
  );
};

export default BidHistory;
