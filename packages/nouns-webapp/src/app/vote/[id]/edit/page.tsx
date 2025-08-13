import EditProposalPage from '@/pages/EditProposal';

export default function VoteEdit() {
  return <EditProposalPage match={{ params: { id: ':id' } }} />;
}
