import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneVrb from '../StandaloneVrb';
import { LoadingVrb } from '../Vrb';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestVrbId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestVrbId } = props;

  if (!latestVrbId) return null;

  const startAtZero = BigNumber.from(latestVrbId).sub(historyCount).lt(0);

  let vrbIds: Array<BigNumber | null> = new Array(historyCount);
  vrbIds = vrbIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestVrbId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestVrbId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const vrbsContent = vrbIds.map((vrbId, i) => {
    return !vrbId ? <LoadingVrb key={i} /> : <StandaloneVrb key={i} vrbId={vrbId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && vrbsContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
