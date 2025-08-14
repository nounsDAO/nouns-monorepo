import EditCandidatePage from '@/components/EditCandidatePage';

export default function CandidateEdit() {
  return <EditCandidatePage match={{ params: { id: ':id' } }} />;
}
