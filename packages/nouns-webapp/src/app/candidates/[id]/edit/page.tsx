import EditCandidatePage from '@/pages/EditCandidate';

export default function CandidateEdit() {
  return <EditCandidatePage match={{ params: { id: ':id' } }} />;
}
