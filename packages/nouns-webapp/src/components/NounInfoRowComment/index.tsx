import { BigNumber } from '@ethersproject/bignumber';
import React, { useState } from 'react';
import { isNounderNoun } from '../../utils/nounderNoun';

import classes from './NounInfoRowComment.module.css';
import _CommentIcon from '../../assets/icons/Comment.svg';

import { Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { bidsByAuctionQueryForWinningBid } from '../../wrappers/subgraph';
import CommentModal from '../CommentModal';
import { Trans } from '@lingui/macro';
import { isMobileScreen } from '../../utils/isMobile';
import TruncatedComment from '../TruncatedComment';

interface NounInfoRowCommentProps {
  nounId: number;
  nounWinner: string;
}

const NounInfoRowComment: React.FC<NounInfoRowCommentProps> = props => {
  const { nounId, nounWinner } = props;
  const { loading, error, data } = useQuery(
    bidsByAuctionQueryForWinningBid(nounId.toString(), nounWinner.toLowerCase()),
  );

  const [showCommentModal, setShowCommentModal] = useState(false);
  const showCommentModalHandler = () => setShowCommentModal(true);
  const dismissCommentModalHanlder = () => setShowCommentModal(false);

  const isBurned = data ? data.bids.length === 0 : true;
  const isRewardOrBurned = isNounderNoun(BigNumber.from(nounId)) || isBurned;

  const bid = !isRewardOrBurned && data ? data.bids[0] : null;
  const winner = bid !== null ? bid.noun.owner.id : 'null';
  const comment = bid !== null ? bid.comment : 'null';

  const isMobile = isMobileScreen();
  const commentLength = isMobile ? 13 : 35;

  if (loading) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Failed to fetch noun info</div>;
  }

  return (
    <>
      {showCommentModal && (
        <CommentModal
          onDismiss={dismissCommentModalHanlder}
          bidder={winner}
          comment={comment}
          nounId={BigNumber.from(nounId)}
          amount={BigNumber.from(bid.amount)}
          timestamp={BigNumber.from(bid.blockTimestamp)}
        />
      )}
      {!isRewardOrBurned ? (
        <div className={classes.commentInfoContainer}>
          <span>
            <Image src={_CommentIcon} className={classes.commentIcon} />
          </span>
          <Trans>Comment</Trans>
          {comment.length > commentLength ? (
            <span onClick={showCommentModalHandler} className={classes.nounInfoRowTruncatedComment}>
              <TruncatedComment comment={comment} />
            </span>
          ) : (
            <span className={classes.nounInfoRowComment}>
              <TruncatedComment comment={comment} />
            </span>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NounInfoRowComment;
