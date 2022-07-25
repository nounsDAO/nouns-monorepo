import { StandaloneNounCircular } from '../../components/StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';
import NounHoverCard from '../NounHoverCard';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

interface NounImageVoteTableProps {
  nounIds: string[];
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const NounImageVoteTable: React.FC<NounImageVoteTableProps> = props => {
  const { nounIds, propId } = props;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds, propId);
  const [page, setPage] = useState(0);

  const content = (page: number) => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

    const paddedNounIds = shuffledNounIds
      .map((nounId: string) => {
        return (
          <HoverCard
            hoverCardContent={(tip: string) => <NounHoverCard nounId={tip} />}
            tip={nounId.toString()}
            id="nounHoverCard"
          >
            <StandaloneNounCircular nounId={EthersBN.from(nounId)} />
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
              <td key={j}>{paddedNounIds[i * rowLength + j]}</td>
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
        textAlign: 'center'
      }}>
      {
        Array.from(Array(Math.floor(nounIds.length / NOUNS_PER_VOTE_CARD_DESKTOP) + 1).keys()).map((n: number) => {
          if (n === page) {
          return (<span 
          style={{
            color: 'red'
          }}
          >• </span>);
          }
          return (<span>• </span>);
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
          color: 'var(--brand-gray-light-text)'
        }}
        />
        </button>

        <button 
        disabled={(page + 1)*NOUNS_PER_VOTE_CARD_DESKTOP > nounIds.length}
        onClick={
          () => setPage(page + 1)
        }
        style={{border: 'none', backgroundColor: 'transparent'}}>
          <ChevronRightIcon
          style={{
            height: '28px',
            width: '28px',
            color: 'var(--brand-gray-light-text)'
          }}
          />
        </button>
        
      </div>
    </>
  );
};

export default NounImageVoteTable;
