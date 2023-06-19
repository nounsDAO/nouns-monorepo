import React, { useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import DelegateHoverCard from '../DelegateHoverCard';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import TightStackedCircleVrbs from '../TightStackedCircleVrbs';
import classes from './DelegateGroupedVrbImageVoteTable.module.css';
import VoteCardPager from '../VoteCardPager';

interface DelegateGruopedVrbImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; vrbsRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: number;
}

const NOUNS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedVrbImageVoteTable: React.FC<
  DelegateGruopedVrbImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId, proposalCreationBlock } = props;

  const shuffledDelegatedGroupedVrbs = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );
  const [page, setPage] = useState<number>(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedVrbIds = shuffledDelegatedGroupedVrbs
      .map(
        (data: { delegate: string; supportDetailed: 0 | 1 | 2; vrbsRepresented: string[] }) => {
          return (
            <HoverCard
              hoverCardContent={(tip: string) => (
                <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
              )}
              // We add this prefix to prevent collisions with the Vrb info cards
              tip={`delegate-${data.delegate}`}
              id="delegateVoteHoverCard"
            >
              <TightStackedCircleVrbs
                vrbIds={data.vrbsRepresented.map((vrbId: string) => parseInt(vrbId))}
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
              <td className={classes.vrbCell} key={j}>
                {paddedVrbIds[i * rowLength + j]}
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
          (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedVrbs.length
        }
        numPages={
          Math.floor(shuffledDelegatedGroupedVrbs.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1
        }
        currentPage={page}
      />
    </>
  );
};

export default DelegateGruopedVrbImageVoteTable;
