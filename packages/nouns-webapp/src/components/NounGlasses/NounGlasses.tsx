import { Row } from 'react-bootstrap';
import LeftHandle from './LeftHandle';
import Lens from './Lens';
import CenterHandle from './CenterHandle';

const NounGlasses = () => {
  return (
    <Row noGutters={true}>
      <LeftHandle />
      <Lens zIndex={3} />
      <CenterHandle />
      <Lens zIndex={1} />
    </Row>
  );
};

export default NounGlasses;
