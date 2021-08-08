import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneNoun from '../StandaloneNoun';
import config from '../../config';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: BigNumberish;
  rtl: boolean;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounId, rtl } = props;

  let nounIds =
    latestNounId &&
    new Array(historyCount)
      .fill(0)
      .map((_, i) => BigNumber.from(latestNounId).sub(BigNumber.from(i)));

  return (
    <Section bgColor="white" fullWidth={true}>
      <div className={clsx(classes.historyCollection, rtl && classes.rtl)}>
        {config.enableHistory &&
          nounIds &&
          nounIds.map((nounId, i) => <StandaloneNoun key={i} nounId={nounId} />)}
      </div>
    </Section>
  );
};

export default HistoryCollection;
