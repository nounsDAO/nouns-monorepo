import EditCandidatePage from '@/components/edit-candidate-page';

export default function CandidateEdit() {
  return <EditCandidatePage match={{ params: { id: ':id' } }} />;
}
