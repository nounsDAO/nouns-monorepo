import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { processProposalDescriptionText } from '../../utils/processProposalDescriptionText';
import { Proposal } from '../../wrappers/nounsDao';
import remarkBreaks from 'remark-breaks';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../utils/etherscan';
import { utils } from 'ethers';
import classes from './ProposalContent.module.css';
import { Trans } from '@lingui/macro';
import EnsOrLongAddress from '../EnsOrLongAddress';

interface ProposalContentProps {
  proposal?: Proposal;
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
  const { proposal } = props;

  return (
    <>
      <Row>
        <Col className={classes.section}>
          <h5>
            <Trans>Description</Trans>
          </h5>
          {proposal?.description && (
            <ReactMarkdown
              className={classes.markdown}
              children={processProposalDescriptionText(proposal.description, proposal.title)}
              remarkPlugins={[remarkBreaks]}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col className={classes.section}>
          <h5>
            <Trans>Proposed Transactions</Trans>
          </h5>
          <ol>
            {proposal?.details?.map((d, i) => {
              return (
                <li key={i} className="m-0">
                  {linkIfAddress(d.target)}.{d.functionSig}
                  {d.value}(
                  <br />
                  {d.callData.split(',').map((content, i) => {
                    return (
                      <Fragment key={i}>
                        <span key={i}>
                          &emsp;
                          {linkIfAddress(content)}
                          {d.callData.split(',').length - 1 === i ? '' : ','}
                        </span>
                        <br />
                      </Fragment>
                    );
                  })}
                  )
                </li>
              );
            })}
          </ol>
        </Col>
      </Row>
    </>
  );
};

export default ProposalContent;
