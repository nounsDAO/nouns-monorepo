import { StandaloneNounBRCircular } from '../../components/StandaloneNounBR';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounBRImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';
import NounBRHoverCard from '../NounBRHoverCard';
import React, { useState } from 'react';
import VoteCardPager from '../VoteCardPager';

interface NounBRImageVoteTableProps {
  nounbrIds: string[];
  propId: number;
}
const NOUNSBR_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const NounBRImageVoteTable: React.FC<NounBRImageVoteTableProps> = props => {
  const { nounbrIds, propId } = props;

  const shuffledNounBRIds = pseudoRandomPredictableShuffle(nounbrIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedNounBRIds = shuffledNounBRIds
      .map((nounbrId: string) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => <NounBRHoverCard nounbrId={tip} />}
            tip={nounbrId.toString()}
            id="nounbrHoverCard"
          >
            <StandaloneNounBRCircular nounbrId={EthersBN.from(nounbrId)} />
          </HoverCard>
        );
      })
      .slice(page * NOUNSBR_PER_VOTE_CARD_DESKTOP, (page + 1) * NOUNSBR_PER_VOTE_CARD_DESKTOP)
      .concat(Array(NOUNSBR_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td key={j}>{paddedNounBRIds[i * rowLength + j]}</td>
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
        isRightArrowDisabled={(page + 1) * NOUNSBR_PER_VOTE_CARD_DESKTOP > nounbrIds.length}
        numPages={Math.floor(nounbrIds.length / NOUNSBR_PER_VOTE_CARD_DESKTOP) + 1}
        currentPage={page}
      />
    </>
  );
};

export default NounBRImageVoteTable;
