import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useState } from 'react';
import { isNounderNoun } from '../../utils/nounderNoun';

import classes from './NounInfoRowComment.module.css';
import _CommentIcon from '../../assets/icons/Comment.svg';

import { Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { bidsByAuctionQueryForWinningBid } from '../../wrappers/subgraph';
import { useAppSelector } from '../../hooks';
import CommentModal from '../CommentModal';
import { Trans } from '@lingui/macro';
import { isMobileScreen } from '../../utils/isMobile';

interface NounInfoRowCommentProps {
  nounId: number;
}
// TODO: badwords filter on comments

const NounInfoRowComment: React.FC<NounInfoRowCommentProps> = props => {
  const { nounId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const { loading, error, data } = useQuery(bidsByAuctionQueryForWinningBid(nounId.toString()));

  const [displayedComment, setDisplayedComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const showCommentModalHandler = () => setShowCommentModal(true);
  const dismissCommentModalHanlder = () => setShowCommentModal(false);

  const isBurned = data ? data.bids.length === 0 : true;
  const isRewardOrBurned = isNounderNoun(BigNumber.from(nounId)) || isBurned;

  const bid = !isRewardOrBurned && data ? data.bids[0] : null;
  const winner = bid !== null ? bid.noun.owner.id : 'null';
  const comment = bid !== null ? bid.comment : 'null';

  const isMobile = isMobileScreen();
  const commentLength = isMobile ? 13 : 30
  
  useEffect(() => {
    if (!comment) return;

    if (comment.length > commentLength) {
      let truncComment = comment.substring(0, commentLength);

      // check the next character, if it is not a space, go back to previous space
      if (comment.length > commentLength && comment[commentLength] !== ' ') {
        truncComment = truncComment.substring(0, truncComment.lastIndexOf(' '));
      }
      // add ellipsis
      setDisplayedComment(truncComment + '...');
    } else {
      setDisplayedComment(comment);
    }
  }, [comment]);

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
            <span
              onClick={showCommentModalHandler}
              className={isCool ? classes.linkCool : classes.linkWarm}
            >
              {`"${displayedComment}"`}
            </span>
          ) : (
            <span className={classes.nounInfoRowComment}>{`"${displayedComment}"`}</span>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NounInfoRowComment;
