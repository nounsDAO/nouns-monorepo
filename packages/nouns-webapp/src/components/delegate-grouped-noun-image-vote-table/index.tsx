import React, { useState } from 'react';

import DelegateHoverCard from '@/components/delegate-hover-card';
import { GrayCircle } from '@/components/gray-circle';
import HoverCard from '@/components/hover-card';
import TightStackedCircleNouns from '@/components/tight-stacked-circle-nouns';
import VoteCardPager from '@/components/vote-card-pager';
import { pseudoRandomPredictableShuffle } from '@/utils/pseudo-random-predictable-shuffle';

interface DelegateGruopedNounImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: bigint;
}

const NOUNS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedNounImageVoteTable: React.FC<
  DelegateGruopedNounImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId, proposalCreationBlock } = props;

  const shuffledDelegatedGroupedNouns = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );
  const [page, setPage] = useState<number>(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedNounIds = shuffledDelegatedGroupedNouns
      .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {
        return (
          <HoverCard
            key={`delegate-${data.delegate}`}
            hoverCardContent={(tip: string) => (
              <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
            )}
            // We add this prefix to prevent collisions with the Noun info cards
            tip={`delegate-${data.delegate}`}
            id="delegateVoteHoverCard"
          >
            <TightStackedCircleNouns
              nounIds={data.nounsRepresented.map((nounId: string) => Number(nounId))}
            />
          </HoverCard>
        );
      })
      .slice(page * NOUNS_PER_VOTE_CARD_DESKTOP, (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP)
      .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />));

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr key={i}>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td className="w-[55px] text-center" key={j}>
                {paddedNounIds[i * rowLength + j]}
              </td>
            ))}
        </tr>
      ));
  };

  return (
    <>
      <table className="mx-auto -mt-5">
        <tbody>{content(page)}</tbody>
      </table>
      <VoteCardPager
        onLeftArrowClick={() => setPage(page - 1)}
        onRightArrowClick={() => setPage(page + 1)}
        isLeftArrowDisabled={page === 0}
        isRightArrowDisabled={
          (page + 1) * NOUNS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedNouns.length
        }
        numPages={
          Math.floor(shuffledDelegatedGroupedNouns.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1
        }
        currentPage={page}
      />
    </>
  );
};

export default DelegateGruopedNounImageVoteTable;
