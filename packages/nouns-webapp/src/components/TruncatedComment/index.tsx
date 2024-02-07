import React from 'react';
import { isMobileScreen } from '../../utils/isMobile';

const TruncatedComment: React.FC<{ comment: string }> = props => {
  const { comment } = props;
  const isMobile = isMobileScreen();
  const commentLength = isMobile ? 13 : 35;
  
  const getDisplayedComment = (comment: string) => {
    if (!comment) return '';

    if (comment.length > commentLength) {
      let truncComment = comment.substring(0, commentLength);
      if (comment[commentLength] !== ' ') {
        truncComment = truncComment.substring(0, truncComment.lastIndexOf(' '));
      }
      return truncComment + '...';
    }
    return comment;
  };

  const displayedComment = getDisplayedComment(comment);

  return <>{displayedComment}</>;
};

export default TruncatedComment;
