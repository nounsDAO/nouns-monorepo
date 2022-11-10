import React, { useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import DelegateHoverCard from '../DelegateHoverCard';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import TightStackedCircleNounsBR from '../TightStackedCircleNounsBR';
import classes from './DelegateGroupedNounBRImageVoteTable.module.css';
import VoteCardPager from '../VoteCardPager';

interface DelegateGruopedNounBRImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsbrRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: number;
}

const NOUNSBR_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedNounBRImageVoteTable: React.FC<
  DelegateGruopedNounBRImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId, proposalCreationBlock } = props;

  const shuffledDelegatedGroupedNounsBR = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );
  const [page, setPage] = useState<number>(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedNounBRIds = shuffledDelegatedGroupedNounsBR
      .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsbrRepresented: string[] }) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => (
              <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
            )}
            // We add this prefix to prevent collisions with the NounBR info cards
            tip={`delegate-${data.delegate}`}
            id="delegateVoteHoverCard"
          >
            <TightStackedCircleNounsBR
              nounbrIds={data.nounsbrRepresented.map((nounbrId: string) => parseInt(nounbrId))}
            />
          </HoverCard>
        );
      })
      .slice(page * NOUNSBR_PER_VOTE_CARD_DESKTOP, (page + 1) * NOUNSBR_PER_VOTE_CARD_DESKTOP)
      .concat(Array(NOUNSBR_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td className={classes.nounbrCell} key={j}>
                {paddedNounBRIds[i * rowLength + j]}
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
          (page + 1) * NOUNSBR_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedNounsBR.length
        }
        numPages={
          Math.floor(shuffledDelegatedGroupedNounsBR.length / NOUNSBR_PER_VOTE_CARD_DESKTOP) + 1
        }
        currentPage={page}
      />
    </>
  );
};

export default DelegateGruopedNounBRImageVoteTable;
