import { Link } from "react-router-dom";
import Section from "../../layout/Section";
import { getDraftProposals } from "../CreateDraftProposal/DraftProposalsStorage";

const DraftProposals = () => {
  const draftProposals = getDraftProposals();

  const proposals = draftProposals.map((p, i) => {
    return (
    <div>
      <Link to={`/draft-proposals/${i}`}>{i}. {p.proposalContent.description.split('\n')[0]}</Link>
    </div>
    );
  });

  return (
    <Section fullWidth={false}>
      <div>Draft Proposals!</div>
      <div>
        {proposals}
      </div>
    </Section>
  )
}

export default DraftProposals;