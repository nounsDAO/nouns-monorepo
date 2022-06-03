import React, { useEffect, useState } from 'react';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import { GrayCircle } from '../GrayCircle';
import HoverCard from '../HoverCard';
import classes from './DelegateGroupedNounImageVoteTable.module.css';
import TightStackedCircleNouns from '../StackedCircleNouns';
import DelegateViewVoteHoverCard from '../DelegateViewVoteHoverCard';
import { useEthers } from '@usedapp/core';

interface DelegateGruopedNounImageVoteTableProps {
  filteredDelegateGroupedVoteData:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 12;

const DelegateGroupedNounImageVoteTable: React.FC<
  DelegateGruopedNounImageVoteTableProps
> = props => {
  const { filteredDelegateGroupedVoteData, propId } = props;

  const shuffledFilteredDelegateGroupedVoteData = pseudoRandomPredictableShuffle(
    filteredDelegateGroupedVoteData,
    propId,
  );

  const { library } = useEthers();
  const [ensCached, setEnsCached] = useState(false);
  // Cache ENS with 30min TTL to make loading more seamless
  useEffect(() => {
    if (!filteredDelegateGroupedVoteData || !library || ensCached) {
      return;
    }

    filteredDelegateGroupedVoteData.forEach((
      delegateInfo: {delegate: string}
    ) => {
        library
          .lookupAddress(delegateInfo.delegate)
          .then(name => {
            // Store data as mapping of address_Expiration => address or ENS
            if (name) {
              localStorage.setItem(`${delegateInfo.delegate}`, JSON.stringify({
                name, 
                expires: Date.now()/1000 + 30*60
              }));
            } 
          })
          .catch(error => {
            console.log(`error resolving reverse ens lookup: `, error);
          });
    });
    setEnsCached(true);

  }, [library, ensCached, filteredDelegateGroupedVoteData]);

  const paddedNounIds = shuffledFilteredDelegateGroupedVoteData
    .map((data: { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }) => {

      localStorage.setItem(`${data.delegate}-${propId}`, JSON.stringify(data));
      return (
        <HoverCard
          id={"DeleateViewVoteHoverCard"}
          hoverCardContent={(dataTip: string) => <DelegateViewVoteHoverCard voteId={dataTip} />}
          tip={`${data.delegate}-${propId}`}
        >
          <TightStackedCircleNouns
            nounIds={data.nounsRepresented.map((nounId: string) => parseInt(nounId))}
          />
        </HoverCard>
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
              <td className={classes.nounCell}
              key={j}
              >
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
