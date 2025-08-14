import EditProposalPage from '@/components/EditProposalPage';

export default function VoteEdit() {
  return <EditProposalPage match={{ params: { id: ':id' } }} />;
}
