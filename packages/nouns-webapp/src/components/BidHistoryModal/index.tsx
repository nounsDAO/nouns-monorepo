import classes from './BidHistoryModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Auction } from '../../wrappers/nAuction';
import { StandaloneTokenRoundedCorners } from '../StandaloneToken';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { Bid } from '../../utils/types';
import BidHistoryModalRow from '../BidHistoryModalRow';
import { Trans } from '@lingui/macro';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const BidHistoryModalOverlay: React.FC<{
  auction: Auction;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, auction } = props;

  const bids = useAuctionBids(auction.tokenId);

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
              <StandaloneTokenRoundedCorners tokenId={auction && auction.tokenId} />
            </div>

            <div className={classes.title}>
              <h2>
                <Trans>Bids for</Trans>
              </h2>
              <h1>Punk {auction && auction.tokenId.toString()}</h1>
            </div>
          </div>
          <div className={classes.bidWrapper}>
            {bids && bids.length > 0 ? (
              <ul>
                {bids?.map((bid: Bid, i: number) => {
                  return <BidHistoryModalRow index={i} bid={bid} />;
                })}
              </ul>
            ) : (
              <div className={classes.nullStateText}>
                <Trans>Bids will appear here</Trans>
              </div>
            )}
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
