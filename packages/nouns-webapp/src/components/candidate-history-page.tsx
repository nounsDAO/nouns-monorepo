'use client';
import { useEffect, useMemo, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ReactDiffViewer from 'react-diff-viewer';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import ProposalContent from '@/components/proposal-content';
import ProposalTransactionsDiffs from '@/components/proposal-content/proposal-transactions-diffs';
import VersionTab from '@/components/proposal-history-page/version-tab';
import Section from '@/components/section';
import { cn } from '@/lib/utils';
import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import {
  ProposalCandidateVersionContent,
  useCandidateProposalVersions,
} from '@/wrappers/nouns-data';
import { Link, useParams } from 'react-router';

 

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidateHistoryPage = () => {
  const { id, versionNumber } = useParams<{ id: string; versionNumber?: string }>();
  const proposal = useCandidateProposalVersions(Number(id).toString());
  const [isDiffsVisible, setIsDiffsVisible] = useState(false);
  const [activeVersionState, setActiveVersionState] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(true);
  const proposalVersions = proposal?.data?.versions.reverse();

  const activeVersion = useMemo(() => {
    if (activeVersionState !== null) return activeVersionState;
    if (versionNumber) return Number(versionNumber);
    return proposalVersions?.length ?? 0;
  }, [activeVersionState, versionNumber, proposalVersions]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => {
      setShowToast(false);
    }, 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  const setActiveVersion = (v: number) => setActiveVersionState(v);

  const highlightSyntax = (str: string) => {
    return (
      <ReactMarkdown
        className={cn(
          'font-pt text-[1.1rem] [&_h1]:text-[1.7rem] [&_h1]:mt-4 [&_h1]:font-bold [&_h2]:text-[1.5rem] [&_h2]:mt-4 [&_h2]:font-bold [&_h3]:text-[1.3rem] [&_img]:max-w-full [&_img]:h-auto',
          '[&_.section]:break-words [&_.section]:pt-8 [&_.section]:mt-8',
          '[&_.section_h5]:text-[1.7rem] [&_.section_h5]:mt-4 [&_.section_h5]:font-londrina',
          '[&_.txnInfoText]:text-[var(--brand-gray-light-text)] [&_.txnInfoText]:-ml-[0.1rem] [&_.txnInfoText]:mt-1 [&_.txnInfoText]:mb-1 [&_.txnInfoText]:font-medium [&_.txnInfoText]:text-[16px] [&_.txnInfoText]:flex [&_.txnInfoText]:items-center',
          'lg-max:[&_.txnInfoText]:items-start lg-max:[&_.txnInfoText]:mt-4',
          '[&_.txnInfoIcon]:h-[18px] [&_.txnInfoIcon]:w-[18px] [&_.txnInfoIcon]:opacity-50',
          'lg-max:[&_.txnInfoIcon]:mt-1 lg-max:[&_.txnInfoIcon]:mr-2',
          '[&_.txnInfoIconWrapper]:w-[25px] [&_.txnInfoIconWrapper]:flex [&_.txnInfoIconWrapper]:items-center',
          '[&_.v3Proposal\.section]:pt-0 [&_.v3Proposal\.section]:mt-0',
        )}
        remarkPlugins={[remarkBreaks]}
      >
        {str}
      </ReactMarkdown>
    );
  };

  const headerDiffs = (str: string) => {
    return (
      <h1 className={"font-londrina mt-4 text-[1.7rem] text-[var(--brand-gray-light-text)]"}>
        {str}
      </h1>
    );
  };

  return (
    <Section fullWidth={false} className={"[&_a]:text-[var(--brand-dark-red)]"}>
      <div className={"mx-auto"}>
        <div className={'relative'}>
          <Link to={`/candidates/${id}`}>
                <button
                  type="button"
                  className={cn(
                    'appearance-none p-0 inline-block w-8 h-8 rounded-full font-bold mr-4 mt-[0.1rem] absolute left-[-3rem]',
                    'border border-black/10 bg-white text-[rgb(95,95,95)] hover:bg-[#e2e3e8] hover:text-black',
                    'max-[1040px]:relative max-[1040px]:left-0 max-[414px]:hidden',
                  )}
                >
              ←
            </button>
          </Link>
        </div>
        <div>
          <span className={'text-[#8c8d92] text-[24px] font-londrina'}>
            <div className="d-flex">
              <div>
                <Trans>Proposal Candidate</Trans>
              </div>
            </div>
          </span>
          <div className={'flex pr-8'}>
            <div className={cn('mr-2', 'w-full')}>
              {isDiffsVisible && proposalVersions && activeVersion >= 2 ? (
                <div className={"m-0 p-0"}>
                  <ReactDiffViewer
                    oldValue={proposalVersions[activeVersion - 2].title}
                    newValue={proposalVersions[activeVersion - 1].title}
                    splitView={false}
                    hideLineNumbers={true}
                    extraLinesSurroundingDiff={10000}
                    renderContent={headerDiffs}
                    disableWordDiff={true}
                    showDiffOnly={false}
                  />
                </div>
              ) : (
                <h1 className={'text-[#14161b] text-[42px] font-londrina'}>
                  {proposalVersions
                    ? proposalVersions[activeVersion > 0 ? activeVersion - 1 : activeVersion].title
                    : proposal.data?.title}{' '}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={cn('mt-4 bg-white', 'mx-auto')}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {((!isDiffsVisible && proposalVersions && activeVersion) ||
              (isDiffsVisible && proposalVersions && activeVersion < 2)) && (
              <ProposalContent
                description={proposalVersions[activeVersion - 1].description}
                title={proposalVersions[activeVersion - 1].title}
                details={proposalVersions[activeVersion - 1].details}
                hasSidebar={true}
              />
            )}
            {isDiffsVisible && proposalVersions && activeVersion >= 2 && (
              <div className={"m-0 p-0"}>
                <div className={cn('mt-8 break-words pt-8', 'm-0 p-0')}>
                  <h5>
                    <Trans>Description</Trans>
                  </h5>
                </div>
                <ReactDiffViewer
                  oldValue={processProposalDescriptionText(
                    proposalVersions[activeVersion - 2].description,
                    proposalVersions[activeVersion - 2].title,
                  )}
                  newValue={processProposalDescriptionText(
                    proposalVersions[activeVersion - 1].description,
                    proposalVersions[activeVersion - 1].title,
                  )}
                  splitView={false}
                  hideLineNumbers={true}
                  extraLinesSurroundingDiff={10000}
                  renderContent={highlightSyntax}
                  showDiffOnly={false}
                />
                <div>
                  <div className={'mt-8 break-words pt-8'}>
                    <h5>
                      <Trans>Proposed Transactions</Trans>
                    </h5>
                    <ProposalTransactionsDiffs
                      activeVersionNumber={activeVersion}
                      oldTransactions={proposalVersions[activeVersion - 2].details}
                      newTransactions={proposalVersions[activeVersion - 1].details}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <div className={"sticky top-[20px] max-[992px]:relative"}>
              <div className={"mb-4 flex items-baseline justify-between"}>
                <h2>
                  <Trans>Version History</Trans>
                </h2>
              </div>
              <div className={"flex flex-col gap-[10px] text-[var(--brand-gray-light-text)]"}>
                {proposalVersions &&
                  proposalVersions
                    .map((version: ProposalCandidateVersionContent, i: number) => (
                      <VersionTab
                        key={version.versionNumber ?? i}
                        id={Number(id).toString()}
                        createdAt={version.createdAt}
                        versionNumber={version.versionNumber}
                        updateMessage={version.updateMessage}
                        isActive={i + 1 === activeVersion}
                        setActiveVersion={setActiveVersion}
                        isCandidate={true}
                      />
                    ))
                    .reverse()}
              </div>
              {activeVersion > 1 && (
                <button
                  type="button"
                  className={cn(
                    'mx-auto mb-0 mt-4 block rounded-lg border-2 border-transparent bg-black px-3 py-2 text-center text-[14px] font-bold text-white',
                    isDiffsVisible && 'border-[3px] border-black bg-white text-black',
                  )}
                  onClick={() => setIsDiffsVisible(!isDiffsVisible)}
                >
                  {isDiffsVisible ? 'Hide' : ' View'} diffs
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CandidateHistoryPage;
