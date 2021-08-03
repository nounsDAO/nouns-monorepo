import { Container } from 'react-bootstrap';
import { useAllProposals } from '../../wrappers/nounsDao';
import { useUserDelegatee, useUserVotes } from '../../wrappers/nounToken';

const Governance = () => {
  const { data: allProposals, loading: loadingProposals } = useAllProposals();
  const availableVotes = useUserVotes();
  const userDelegatee = useUserDelegatee();

  return (
    <Container></Container>
  );
}
export default Governance;
