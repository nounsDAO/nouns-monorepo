import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { processProposalDescriptionText } from '../../utils/processProposalDescriptionText';
import { ProposalDetail } from '../../wrappers/nounsDao';
import remarkBreaks from 'remark-breaks';
import {
  buildEtherscanAddressLink,
  buildEtherscanHoldingsLink,
  buildEtherscanTxLink,
} from '../../utils/etherscan';
import { utils } from 'ethers';
import classes from './ProposalContent.module.css';
import { Trans } from '@lingui/macro';
import EnsOrLongAddress from '../EnsOrLongAddress';
import clsx from 'clsx';
import ProposalTransactions from './ProposalTransactions';
import linkIcon from '../../assets/icons/Link.svg';
import config from '../../config';

interface ProposalContentProps {
  description: string;
  title: string;
  details: ProposalDetail[];
  hasSidebar?: boolean;
  proposeOnV1?: boolean;
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
export const transactionIconLink = (content: string) => {
  return (
    <a href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
      <img src={linkIcon} width={16} alt="link symbol" />
    </a>
  );
};

const ProposalContent: React.FC<ProposalContentProps> = props => {
  const { description, title, details } = props;
  const daoEtherscanLink = buildEtherscanHoldingsLink(
    config.addresses.nounsDaoExecutor ?? '', // This should always point at the V1 executor
  );

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
            {props.proposeOnV1 && (
              <Alert variant="warning" className="mb-4">
                <Trans>
                  This proposal interacts with the{' '}
                  <a href={daoEtherscanLink} target="_blank" rel="noreferrer">
                    original treasury
                  </a>
                </Trans>
              </Alert>
            )}
            <ProposalTransactions details={details} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProposalContent;
