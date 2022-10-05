import React, { useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import DelegateHoverCard from '../DelegateHoverCard';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import TightStackedCircleTokens from '../TightStackedCircleTokens';
import classes from './DelegateGroupedTokenImageVoteTable.module.css';
import VoteCardPager from '../VoteCardPager';

interface DelegateGruopedTokenImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: number;
}

const TOKENS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedTokenImageVoteTable: React.FC<
DelegateGruopedTokenImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId, proposalCreationBlock } = props;

  const shuffledDelegatedGroupedTokens = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );
  const [page, setPage] = useState<number>(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedTokenIds = shuffledDelegatedGroupedTokens
      .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nRepresented: string[] }) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => (
              <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
            )}
            // We add this prefix to prevent collisions with the Noun info cards
            tip={`delegate-${data.delegate}`}
            id="delegateVoteHoverCard"
          >
            <TightStackedCircleTokens
              tokenIds={data.nRepresented.map((tokenId: string) => parseInt(tokenId))}
            />
          </HoverCard>
        );
      })
      .slice(page * TOKENS_PER_VOTE_CARD_DESKTOP, (page + 1) * TOKENS_PER_VOTE_CARD_DESKTOP)
      .concat(Array(TOKENS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td className={classes.tokenCell} key={j}>
                {paddedTokenIds[i * rowLength + j]}
              </td>
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
        isRightArrowDisabled={
          (page + 1) * TOKENS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedTokens.length
        }
        numPages={
          Math.floor(shuffledDelegatedGroupedTokens.length / TOKENS_PER_VOTE_CARD_DESKTOP) + 1
        }
        currentPage={page}
      />
    </>
  );
};

export default DelegateGruopedTokenImageVoteTable;
