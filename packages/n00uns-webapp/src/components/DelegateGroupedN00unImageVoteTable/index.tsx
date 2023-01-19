import React, { useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import DelegateHoverCard from '../DelegateHoverCard';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import TightStackedCircleN00uns from '../TightStackedCircleN00uns';
import classes from './DelegateGroupedN00unImageVoteTable.module.css';
import VoteCardPager from '../VoteCardPager';

interface DelegateGruopedN00unImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; n00unsRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: number;
}

const NOUNS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedN00unImageVoteTable: React.FC<
  DelegateGruopedN00unImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId, proposalCreationBlock } = props;

  const shuffledDelegatedGroupedN00uns = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );
  const [page, setPage] = useState<number>(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedN00unIds = shuffledDelegatedGroupedN00uns
      .map(
        (data: { delegate: string; supportDetailed: 0 | 1 | 2; n00unsRepresented: string[] }) => {
          return (
            <HoverCard
              hoverCardContent={(tip: string) => (
                <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
              )}
              // We add this prefix to prevent collisions with the N00un info cards
              tip={`delegate-${data.delegate}`}
              id="delegateVoteHoverCard"
            >
              <TightStackedCircleN00uns
                n00unIds={data.n00unsRepresented.map((n00unId: string) => parseInt(n00unId))}
              />
            </HoverCard>
          );
        },
      )
      .slice(page * NOUNS_PER_VOTE_CARD_DESKTOP, (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP)
      .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td className={classes.n00unCell} key={j}>
                {paddedN00unIds[i * rowLength + j]}
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
          (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedN00uns.length
        }
        numPages={
          Math.floor(shuffledDelegatedGroupedN00uns.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1
        }
        currentPage={page}
      />
    </>
  );
};

export default DelegateGruopedN00unImageVoteTable;
