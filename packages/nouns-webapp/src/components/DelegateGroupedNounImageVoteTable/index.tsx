import React from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import classes from './DelegateGroupedNounImageVoteTable.module.css';
import TightStackedCircleNouns from '../StackedCircleNouns';

interface DelegateGruopedNounImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const DelegateGroupedNounImageVoteTable: React.FC<
  DelegateGruopedNounImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId } = props;

  const shuffledFilteredDelegateGroupedVoteData = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );

  console.log(shuffledFilteredDelegateGroupedVoteData);

  const paddedNounIds = shuffledFilteredDelegateGroupedVoteData
    .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {
      return (
        <HoverCard
          hoverCardContent={(dataTip: string) => <>{dataTip} is cool</>}
          tip={data.delegate}
        >
          <TightStackedCircleNouns
            nounIds={data.nounsRepresented.map((nounId: string) => parseInt(nounId))}
          />
        </HoverCard>
      );
    })
    .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle small={true} />))
    .slice(0, NOUNS_PER_VOTE_CARD_DESKTOP);

  const content = () => {
    const rows = 3;
    const rowLength = isXLScreen ? 5 : 4;

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
    <table className={classes.wrapper}>
      <tbody>{content()}</tbody>
    </table>
  );
};

export default DelegateGroupedNounImageVoteTable;
