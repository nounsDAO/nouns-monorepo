import React from "react";
import { pseudoRandomPredictableShuffle } from "../../utils/pseudoRandomPredictableShuffle";
import { GrayCircle } from "../GrayCircle";
import HoverCard from "../HoverCard";
import { StandaloneNounCircular } from "../StandaloneNoun";
import classes from "./DelegateGroupedNounImageVoteTable.module.css";
import {BigNumber as EthersBN } from "ethers";
import StackedCircleNouns from "../StackedCircleNouns";

interface DelegateGruopedNounImageVoteTableProps {
    nounIds: string[];
    delegatedNouns: any[];
    propId: number;
};
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const DelegateGroupedNounImageVoteTable: React.FC<DelegateGruopedNounImageVoteTableProps> = props => {

    const {nounIds, delegatedNouns, propId} = props;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds, propId);

  console.log("DELEGATED NOUNS", delegatedNouns);


  const paddedNounIds = shuffledNounIds
    .map((nounId: string) => {
      return (
        <HoverCard hoverCardContent={(dataTip: string) => <>{dataTip} is cool</>} tip={nounId}>
          {/* <StandaloneNounCircular nounId={EthersBN.from(nounId)} /> */}
        </HoverCard>
      );
    })
    .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle />))
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
              <td key={j}>{paddedNounIds[i * rowLength + j]}</td>
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