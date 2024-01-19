import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { processProposalDescriptionText } from '../../utils/processProposalDescriptionText';
import { ProposalCandidate } from '../../wrappers/nounsData';
import remarkBreaks from 'remark-breaks';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../utils/etherscan';
import { utils } from 'ethers';
import classes from './ProposalContent.module.css';
import { Trans } from '@lingui/macro';
import EnsOrLongAddress from '../EnsOrLongAddress';

import clsx from 'clsx';
import ProposalTransactions from './ProposalTransactions';

interface ProposalCandidateContentProps {
  proposal?: ProposalCandidate;
}

export const linkIfAddress = (content: string) => {
  if (utils.isAddress(content)) {
    return (
      <a href={buildEtherscanAddressLink(content)} target="_blank" rel="noreferrer">
        <EnsOrLongAddress address={content} />
      </a>
    );
  }
  return <span>{content}</span>;
};

export const transactionLink = (content: string) => {
  return (
    <a href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
      {content.substring(0, 7)}
    </a>
  );
};

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
