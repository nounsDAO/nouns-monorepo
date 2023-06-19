import { StandaloneVrbCircular } from '../StandaloneVrb';
import { BigNumber as EthersBN } from 'ethers';
import classes from './VrbImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';
import VrbHoverCard from '../VrbHoverCard';
import React, { useState } from 'react';
import VoteCardPager from '../VoteCardPager';

interface VrbImageVoteTableProps {
  vrbIds: string[];
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const VrbImageVoteTable: React.FC<VrbImageVoteTableProps> = props => {
  const { vrbIds, propId } = props;

  const shuffledVrbIds = pseudoRandomPredictableShuffle(vrbIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedVrbIds = shuffledVrbIds
      .map((vrbId: string) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => <VrbHoverCard vrbId={tip} />}
            tip={vrbId.toString()}
            id="vrbHoverCard"
          >
            <StandaloneVrbCircular vrbId={EthersBN.from(vrbId)} />
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
              <td key={j}>{paddedVrbIds[i * rowLength + j]}</td>
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
        isRightArrowDisabled={(page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > vrbIds.length}
        numPages={Math.floor(vrbIds.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1}
        currentPage={page}
      />
    </>
  );
};

export default VrbImageVoteTable;
