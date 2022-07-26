import React, { useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import DelegateHoverCard from '../DelegateHoverCard';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import TightStackedCircleNouns from '../TightStackedCircleNouns';
import classes from './DelegateGroupedNounImageVoteTable.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

interface DelegateGruopedNounImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
  propId: number;
  proposalCreationBlock: number;
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

  // const paddedNounIds = shuffledDelegatedGroupedNouns
  //   .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {
  //     return (
  //       <HoverCard
  //         hoverCardContent={(tip: string) => (
  //           <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
  //         )}
  //         // We add this prefix to prevent collisions with the Noun info cards
  //         tip={`delegate-${data.delegate}`}
  //         id="delegateVoteHoverCard"
  //       >
  //         <TightStackedCircleNouns
  //           nounIds={data.nounsRepresented.map((nounId: string) => parseInt(nounId))}
  //         />
  //       </HoverCard>
  //     );
  //   })
  //   .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />))
  //   .slice(0, NOUNS_PER_VOTE_CARD_DESKTOP);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = 4;

    const paddedNounIds = shuffledDelegatedGroupedNouns
    .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {
      return (
        <HoverCard
          hoverCardContent={(tip: string) => (
            <DelegateHoverCard delegateId={tip} proposalCreationBlock={proposalCreationBlock} />
          )}
          // We add this prefix to prevent collisions with the Noun info cards
          tip={`delegate-${data.delegate}`}
          id="delegateVoteHoverCard"
        >
          <TightStackedCircleNouns
            nounIds={data.nounsRepresented.map((nounId: string) => parseInt(nounId))}
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
              <td className={classes.nounCell} key={j}>
                {paddedNounIds[i * rowLength + j]}
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
     

      {/* Dots */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'var(--brand-gray-light-text)'
      }}>
      {
        Array.from(Array(Math.floor(shuffledDelegatedGroupedNouns.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1).keys()).map((n: number) => {
          if (n === page) {
          return (<span 
          >• </span>);
          }
          return (<span 
            style={{
              opacity: '0.5',
            }}
            
          >• </span>);
        })
      }
      </div>
      {/* Arrows */}
      <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }} 
      >
        <button
        style={{border: 'none', backgroundColor: 'transparent'}}
        disabled={page === 0}
        onClick={
          () => setPage(page - 1)
        }
        >
        <ChevronLeftIcon 
        style={{
          height: '28px',
          width: '28px',
          color: 'var(--brand-gray-light-text)',
          opacity: page === 0 ? '0.5' : '1'
        }}
        />
        </button>

        <button 
        disabled={(page + 1)*NOUNS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedNouns.length}
        onClick={
          () => setPage(page + 1)
        }
        style={{border: 'none', backgroundColor: 'transparent'}}>
          <ChevronRightIcon
          style={{
            height: '28px',
            width: '28px',
            color: 'var(--brand-gray-light-text)',
            opacity: (page + 1)*NOUNS_PER_VOTE_CARD_DESKTOP > shuffledDelegatedGroupedNouns.length ? '0.5' : '1'
          }}
          />
        </button>
        
      </div>
    </>
  );
};

export default DelegateGruopedNounImageVoteTable;
