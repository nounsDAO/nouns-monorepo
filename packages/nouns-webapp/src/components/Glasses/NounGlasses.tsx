import { Row, Container } from 'react-bootstrap';
import LeftHandle from './LeftHandle';
import NounsLens from './NounsLens';
import CenterHandle from './CenterHandle';
import ActivityLens from './ActivityLens';

const NounGlasses = () => {
  return (
    <Container fluid="lg">
      <Row noGutters={true}>
        <LeftHandle />
        <NounsLens />
        <CenterHandle />
        <ActivityLens />
      </Row>
    </Container>
  );
};

export default NounGlasses;
