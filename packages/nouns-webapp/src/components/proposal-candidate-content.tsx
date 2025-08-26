/* eslint-disable react/prop-types */
import { Trans } from '@lingui/react/macro';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { cn } from '@/lib/utils';
import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import { ProposalCandidate } from '@/wrappers/nouns-data';

import ProposalTransactions from './proposal-content/proposal-transactions';

interface ProposalCandidateContentProps {
  proposal?: ProposalCandidate;
}
const ProposalCandidateContent: React.FC<ProposalCandidateContentProps> = props => {
  const { proposal } = props;
  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className={cn('col-span-12 mx-auto mt-8 break-words pt-8')}>
          <h5 className="font-londrina mt-4 text-[1.7rem]">
            <Trans>Description</Trans>
          </h5>
          {proposal?.version.content.description && (
            <ReactMarkdown
              className="font-pt text-[1.1rem] [&_h1]:mt-4 [&_h1]:text-[1.7rem] [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h3]:text-[1.3rem] [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full"
              remarkPlugins={[remarkBreaks]}
            >
              {processProposalDescriptionText(
                proposal.version.content.description,
                proposal.version.content.title,
              )}
            </ReactMarkdown>
          )}
        </div>
      </div>
      {proposal && (
        <div className="grid grid-cols-12 gap-3">
          <div className={cn('col-span-12 mx-auto mt-8 break-words pt-8')}>
            <h5 className="font-londrina mt-4 text-[1.7rem]">
              <Trans>Proposed Transactions</Trans>
            </h5>
            <ProposalTransactions details={proposal.version.content.details} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProposalCandidateContent;
