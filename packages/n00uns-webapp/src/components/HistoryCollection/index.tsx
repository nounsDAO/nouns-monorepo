import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneN00un from '../StandaloneN00un';
import { LoadingN00un } from '../N00un';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestN00unId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestN00unId } = props;

  if (!latestN00unId) return null;

  const startAtZero = BigNumber.from(latestN00unId).sub(historyCount).lt(0);

  let n00unIds: Array<BigNumber | null> = new Array(historyCount);
  n00unIds = n00unIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestN00unId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestN00unId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const n00unsContent = n00unIds.map((n00unId, i) => {
    return !n00unId ? <LoadingN00un key={i} /> : <StandaloneN00un key={i} n00unId={n00unId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && n00unsContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
