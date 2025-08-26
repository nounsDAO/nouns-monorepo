import React from 'react';

import { Trans } from '@lingui/react/macro';
import { Alert } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { isAddress } from 'viem';

import linkIcon from '@/assets/icons/Link.svg';
import EnsOrLongAddress from '@/components/ens-or-long-address';
import { nounsTokenAddress } from '@/contracts';
import { cn } from '@/lib/utils';
import {
  buildEtherscanAddressLink,
  buildEtherscanHoldingsLink,
  buildEtherscanTxLink,
} from '@/utils/etherscan';
import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import { defaultChain } from '@/wagmi';
import { ProposalDetail } from '@/wrappers/nouns-dao';

import ProposalTransactions from './proposal-transactions';

interface ProposalContentProps {
  description: string;
  title: string;
  details: ProposalDetail[];
  hasSidebar?: boolean;
  proposeOnV1?: boolean;
}

export const linkIfAddress = (content: string) => {
  if (isAddress(content)) {
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
  const chainId = defaultChain.id;
  const daoEtherscanLink = buildEtherscanHoldingsLink(nounsTokenAddress[chainId]);

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div
          className={cn(
            'col-span-12 mx-auto mt-8 break-words pt-8',
            props.hasSidebar === true ? 'mt-0 pt-0' : undefined,
          )}
        >
          <h5 className="font-londrina mt-4 text-[1.7rem]">
            <Trans>Description</Trans>
          </h5>
          {description !== '' ? (
            <ReactMarkdown
              className="font-pt text-[1.1rem] [&_h1]:mt-4 [&_h1]:text-[1.7rem] [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h3]:text-[1.3rem] [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full"
              remarkPlugins={[remarkBreaks]}
            >
              {processProposalDescriptionText(description, title)}
            </ReactMarkdown>
          ) : null}
        </div>
      </div>
      {details.length > 0 ? (
        <div className="grid grid-cols-12 gap-3">
          <div className={cn('col-span-12 mx-auto mt-8 break-words pt-8')}>
            <h5 className="font-londrina mt-4 text-[1.7rem]">
              <Trans>Proposed Transactions</Trans>
            </h5>
            {props.proposeOnV1 === true && (
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
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProposalContent;
