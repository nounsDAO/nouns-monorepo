import classes from './CommentModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import ShortAddress from '../ShortAddress';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import dayjs from 'dayjs';
import _CommentIcon from '../../assets/icons/Comment.svg';
import { Image } from 'react-bootstrap';
import { i18n } from '@lingui/core';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

export const CommentModalOverlay: React.FC<{
  onDismiss: () => void;
  bidder: string;
  comment: string;
  nounId: EthersBN;
  amount: EthersBN;
  timestamp: EthersBN;
}> = props => {
  const { onDismiss, bidder, comment, amount, timestamp, nounId } = props;

  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(amount).toString())} />;
  const date = `${dayjs(timestamp.toNumber() * 1000).format('MMM DD')} at ${dayjs(
    timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>
          <div className={classes.bidWrapper}>
            <div className={classes.header}>
              <div className={classes.title}>
                <h2>{`Bid for Noun ${nounId}`}</h2>
              </div>
            </div>

            <div className={classes.bidItem}>
              <div className={classes.bidItemLeftSectionWrapper}>
                <div>
                  <ShortAddress size={40} address={bidder} avatar={true} largeText={true} />
                </div>
              </div>

              <div className={classes.bidItemRightSectionWrapper}>
                <div className={classes.bidAmount}>{bidAmount}</div>
                <div className={classes.bidDate}>
                  {i18n.date(new Date(timestamp.toNumber() * 1000), {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            </div>

            <div className={classes.commentInfoContainer}>
              <span>
                <Image src={_CommentIcon} className={classes.commentIcon} />
              </span>
              <span>{`"${comment}"`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CommentModal: React.FC<{
  onDismiss: () => void;
  bidder: string;
  comment: string;
  nounId: EthersBN;
  amount: EthersBN;
  timestamp: EthersBN;
}> = props => {
  const { onDismiss, bidder, comment, amount, timestamp, nounId } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <CommentModalOverlay
          onDismiss={onDismiss}
          bidder={bidder}
          comment={comment}
          nounId={nounId}
          amount={amount}
          timestamp={timestamp}
        />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default CommentModal;
