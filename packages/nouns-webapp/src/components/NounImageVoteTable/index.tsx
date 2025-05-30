import React, { useState } from 'react';

import { GrayCircle } from '@/components/GrayCircle';
import { StandaloneNounCircular } from '@/components/StandaloneNoun';
import VoteCardPager from '@/components/VoteCardPager';
import { pseudoRandomPredictableShuffle } from '@/utils/pseudoRandomPredictableShuffle';

import classes from './NounImageVoteTable.module.css';

interface NounImageVoteTableProps {
  nounIds: string[];
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const NounImageVoteTable: React.FC<NounImageVoteTableProps> = props => {
  const { nounIds, propId } = props;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedNounIds = shuffledNounIds
      .map((nounId: string) => {
        return <StandaloneNounCircular key={nounId} nounId={BigInt(nounId)} />;
      })
      .slice(page * NOUNS_PER_VOTE_CARD_DESKTOP, (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP)
      .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td key={j}>{paddedNounIds[i * rowLength + j]}</td>
            ))}
        </tr>
      ));
  };

  return (
    <>
      <table className={classes.wrapper}>
        <tbody>{content(page)}</tbody>
      </table>
      <VoteCardPager
        onLeftArrowClick={() => setPage(page - 1)}
        onRightArrowClick={() => setPage(page + 1)}
        isLeftArrowDisabled={page === 0}
        isRightArrowDisabled={(page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > nounIds.length}
        numPages={Math.floor(nounIds.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1}
        currentPage={page}
      />
    </>
  );
};

export default NounImageVoteTable;
