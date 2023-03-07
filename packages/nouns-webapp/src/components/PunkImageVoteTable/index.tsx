import { StandaloneTokenCircular } from '../StandaloneToken';
import { BigNumber as EthersBN } from 'ethers';
import classes from './PunkImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';
import PunkHoverCard from '../PunkHoverCard';
import React, { useState } from 'react';
import VoteCardPager from '../VoteCardPager';

interface PunkImageVoteTableProps {
  tokenIds: string[];
  propId: number;
}
const TOKENS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const TokenImageVoteTable: React.FC<PunkImageVoteTableProps> = props => {
  const { tokenIds, propId } = props;

  const shuffledTokenIds = pseudoRandomPredictableShuffle(tokenIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedTokenIds = shuffledTokenIds
      .map((tokenId: string) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => <PunkHoverCard tokenId={tip} />}
            tip={tokenId.toString()}
            id="nounHoverCard"
          >
            <StandaloneTokenCircular tokenId={EthersBN.from(tokenId)} />
          </HoverCard>
        );
      })
      .slice(page * TOKENS_PER_VOTE_CARD_DESKTOP, (page + 1) * TOKENS_PER_VOTE_CARD_DESKTOP)
      .concat(Array(TOKENS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td key={j}>{paddedTokenIds[i * rowLength + j]}</td>
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
        isRightArrowDisabled={(page + 1) * TOKENS_PER_VOTE_CARD_DESKTOP > tokenIds.length}
        numPages={Math.floor(tokenIds.length / TOKENS_PER_VOTE_CARD_DESKTOP) + 1}
        currentPage={page}
      />
    </>
  );
};

export default TokenImageVoteTable;