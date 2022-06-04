import React from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import { GrayCircle } from '../GrayCircle';
import TightStackedCircleNouns from '../TightStackedCircleNouns';
import classes from './DelegateGroupedNounImageVoteTable.module.css';

interface DelegateGruopedNounImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
  propId: number;
}

const NOUNS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGruopedNounImageVoteTable: React.FC<
  DelegateGruopedNounImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId } = props;

  const shuffledDelegatedGroupedNouns = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );

  const paddedNounIds = shuffledDelegatedGroupedNouns
    .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {
      return (
        <TightStackedCircleNouns
          nounIds={data.nounsRepresented.map((nounId: string) => parseInt(nounId))}
        />
      );
    })
    .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle isDelegateView={true} />))
    .slice(0, NOUNS_PER_VOTE_CARD_DESKTOP);

  const content = () => {
    const rows = 3;
    const rowLength = 4;

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

export default DelegateGruopedNounImageVoteTable;
