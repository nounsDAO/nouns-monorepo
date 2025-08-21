/* eslint-disable react/prop-types */
import { Trans } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import { ProposalCandidate } from '@/wrappers/nouns-data';

import classes from './proposal-content.module.css';
import ProposalTransactions from './proposal-transactions';

interface ProposalCandidateContentProps {
  proposal?: ProposalCandidate;
}
const ProposalCandidateContent: React.FC<ProposalCandidateContentProps> = props => {
  const { proposal } = props;
  return (
    <>
      <Row>
        <Col className={cn(classes.section, classes.v3Proposal, classes.hasSidebar)}>
          <h5>
            <Trans>Description</Trans>
          </h5>
          {proposal?.version.content.description && (
            <ReactMarkdown className={classes.markdown} remarkPlugins={[remarkBreaks]}>
              {processProposalDescriptionText(
                proposal.version.content.description,
                proposal.version.content.title,
              )}
            </ReactMarkdown>
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
