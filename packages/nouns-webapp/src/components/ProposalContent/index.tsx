import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { processProposalDescriptionText } from '../../utils/processProposalDescriptionText';
import { ProposalDetail } from '../../wrappers/nounsDao';
import remarkBreaks from 'remark-breaks';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../utils/etherscan';
import { utils } from 'ethers';
import classes from './ProposalContent.module.css';
import { Trans } from '@lingui/macro';
import EnsOrLongAddress from '../EnsOrLongAddress';
import clsx from 'clsx';
import ProposalTransactions from './ProposalTransactions';

interface ProposalContentProps {
  description: string;
  title: string;
  details: ProposalDetail[];
  hasSidebar?: boolean;
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

const ProposalContent: React.FC<ProposalContentProps> = props => {
  const { description, title, details } = props;
  return (
    <>
      <Row>
        <Col className={clsx(classes.section, props.hasSidebar && classes.hasSidebar)}>
          <h5>
            <Trans>Description</Trans>
          </h5>
          {description && (
            <ReactMarkdown
              className={classes.markdown}
              children={processProposalDescriptionText(description, title)}
              remarkPlugins={[remarkBreaks]}
            />
          )}
        </Col>
      </Row>
      {details && (
        <Row>
          <Col className={classes.section}>
            <h5>
              <Trans>Proposed Transactions</Trans>
            </h5>
            <ProposalTransactions details={details} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProposalContent;
