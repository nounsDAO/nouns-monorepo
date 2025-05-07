import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { processProposalDescriptionText } from '@/utils/processProposalDescriptionText';
import { ProposalCandidate } from '@/wrappers/nounsData';

import classes from './ProposalContent.module.css';
import ProposalTransactions from './ProposalTransactions';

interface ProposalCandidateContentProps {
  proposal?: ProposalCandidate;
}
const ProposalCandidateContent: React.FC<ProposalCandidateContentProps> = props => {
  const { proposal } = props;
  return (
    <>
      <Row>
        <Col className={clsx(classes.section, classes.v3Proposal, classes.hasSidebar)}>
          <h5>
            <Trans>Description</Trans>
          </h5>
          {proposal?.version.content.description && (
            <ReactMarkdown
              className={classes.markdown}
              children={processProposalDescriptionText(
                proposal.version.content.description,
                proposal.version.content.title,
              )}
              remarkPlugins={[remarkBreaks]}
            />
          )}
        </Col>
      </Row>
      {proposal && (
        <Row>
          <Col className={classes.section}>
            <h5>
              <Trans>Proposed Transactions</Trans>
            </h5>
            <ProposalTransactions details={proposal.version.content.details} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProposalCandidateContent;
