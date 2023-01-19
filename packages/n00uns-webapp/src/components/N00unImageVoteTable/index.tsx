import { StandaloneN00unCircular } from '../StandaloneN00un';
import { BigNumber as EthersBN } from 'ethers';
import classes from './N00unImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';
import N00unHoverCard from '../N00unHoverCard';
import React, { useState } from 'react';
import VoteCardPager from '../VoteCardPager';

interface N00unImageVoteTableProps {
  n00unIds: string[];
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const N00unImageVoteTable: React.FC<N00unImageVoteTableProps> = props => {
  const { n00unIds, propId } = props;

  const shuffledN00unIds = pseudoRandomPredictableShuffle(n00unIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedN00unIds = shuffledN00unIds
      .map((n00unId: string) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => <N00unHoverCard n00unId={tip} />}
            tip={n00unId.toString()}
            id="n00unHoverCard"
          >
            <StandaloneN00unCircular n00unId={EthersBN.from(n00unId)} />
          </HoverCard>
        );
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
              <td key={j}>{paddedN00unIds[i * rowLength + j]}</td>
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
        isRightArrowDisabled={(page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > n00unIds.length}
        numPages={Math.floor(n00unIds.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1}
        currentPage={page}
      />
    </>
  );
};

export default N00unImageVoteTable;
