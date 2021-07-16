import { BigNumber, BigNumberish } from 'ethers';
import Section from '../Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import Noun from '../Shared/Noun';
import noun1 from '../../assets/noun-1.png';
import noun2 from '../../assets/noun-2.png';
import noun3 from '../../assets/noun-3.png';
import noun4 from '../../assets/noun-4.png';
import noun5 from '../../assets/noun-5.png';
import noun6 from '../../assets/noun-6.png';
import noun7 from '../../assets/noun-7.png';
import noun8 from '../../assets/noun-8.png';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: BigNumberish;
  rtl: boolean;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounId, rtl } = props;

  let nounIds = new Array(historyCount)
    .fill(0)
    .map((_, i) => BigNumber.from(latestNounId).sub(BigNumber.from(i)));

  const nounImgPaths = [noun1, noun2, noun3, noun4, noun5, noun6, noun7, noun8];

  return (
    <Section bgColor="white" fullWidth={true}>
      <div className={clsx(classes.historyCollection, rtl && classes.rtl)}>
        {nounIds.map((nounId, i) => (
          <Noun key={i} imgPath={nounImgPaths[i]} alt="noun" />
        ))}
      </div>
    </Section>
  );
};

export default HistoryCollection;
