import EditProposalPage from '@/components/edit-proposal-page';

export default function VoteEdit() {
  return <EditProposalPage match={{ params: { id: ':id' } }} />;
}
