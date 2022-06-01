import { StandaloneNounCircular } from '../../components/StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounImageVoteTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import HoverCard from '../HoverCard';

interface NounImageVoteTableProps {
  nounIds: string[];
  propId: number;
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 15;

const isXLScreen = window.innerWidth > 1200;

const NounImageVoteTable: React.FC<NounImageVoteTableProps> = props => {
  const { nounIds, propId } = props;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds, propId);
  const paddedNounIds = shuffledNounIds
    .map((nounId: string) => {
      return (
        <HoverCard hoverCardContent={(dataTip: string) => <>{dataTip} is cool</>} tip={nounId}>
          <StandaloneNounCircular nounId={EthersBN.from(nounId)} />
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

export default NounImageVoteTable;
