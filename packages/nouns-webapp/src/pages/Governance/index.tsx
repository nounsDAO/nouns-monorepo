import { Container } from 'react-bootstrap';
import { useAllProposals } from '../../wrappers/nounsDao';

const Governance = () => {
  const proposals = useAllProposals();

  return (
    <Container></Container>
  );
}
export default Governance;
