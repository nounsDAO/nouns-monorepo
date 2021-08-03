import { Container } from 'react-bootstrap';
import { useAllProposals } from '../../wrappers/nounsDao';
import { useUserDelegatee, useUserVotes } from '../../wrappers/nounToken';
import Proposals from '../../components/Proposals';

const Governance = () => {
  const { data: proposals, loading: proposalsLoading } = useAllProposals();
  const availableVotes = useUserVotes();
  const userDelegatee = useUserDelegatee();

  return (
    <Container>
      <Proposals proposals={proposals} />
    </Container>
  );
}
export default Governance;
