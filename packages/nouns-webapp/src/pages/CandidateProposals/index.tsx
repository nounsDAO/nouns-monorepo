import { Link } from 'react-router-dom';
import Section from '../../layout/Section';
import { useCandidateProposals } from '../../wrappers/nounsData';

const CandidateProposals = () => {
  const { loading, error, data } = useCandidateProposals();

  let candidates: {} | null | undefined = [];

  if (!loading && !error) {
    candidates = data['proposalCandidates'].map((c: any) => {
      return (
        <div>
          <Link to={`/candidates/${c.id}`}>
            {c.latestVersion.title} by {c.proposer}
          </Link>
        </div>
      );
    });
  }

  return (
    <Section fullWidth={false}>
      <div>Proposal candidates</div>
      <div>{candidates}</div>
    </Section>
  );
};

export default CandidateProposals;
