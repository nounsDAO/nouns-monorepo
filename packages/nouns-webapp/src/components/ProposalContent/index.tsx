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
import config from '../../config';
import { InformationCircleIcon } from '@heroicons/react/solid';
import ShortAddress from '../ShortAddress';

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
                  {d.value}
                  {!!d.functionSig ? (
                    <>
                      (<br />
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
                    </>
                  ) : (
                    d.callData
                  )}
                  {d.target.toLowerCase() === config.addresses.tokenBuyer?.toLowerCase() && (
                    <div className={classes.txnInfoText}>
                      <div className={classes.txnInfoIconWrapper}>
                        <InformationCircleIcon className={classes.txnInfoIcon} />
                      </div>
                      <div>
                        <Trans>
                          This transaction was automatically added to refill the TokenBuyer.
                          Proposers do not receive this ETH.
                        </Trans>
                      </div>
                    </div>
                  )}
                  {d.target.toLowerCase() === config.addresses.payerContract?.toLowerCase() && (
                    <div className={classes.txnInfoText}>
                      <div className={classes.txnInfoIconWrapper}>
                        <InformationCircleIcon className={classes.txnInfoIcon} />
                      </div>
                      <div>
                        <Trans>
                          This transaction sends{' '}
                          {Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(
                            Number(utils.formatUnits(d.callData.split(',')[1], 6)),
                          )}{' '}
                          USDC to <ShortAddress address={d.callData.split(',')[0]} /> via the DAO's
                          PayerContract.
                        </Trans>
                      </div>
                    </div>
                  )}
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
