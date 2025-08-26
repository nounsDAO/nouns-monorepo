'use client';
import { useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
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
import ProposalStatus from '@/components/proposal-status';
import Section from '@/components/section';
import { cn } from '@/lib/utils';
import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import { useProposal, useProposalVersions } from '@/wrappers/nouns-dao';
import { Link, useParams } from 'react-router';

import VersionTab from './version-tab';

import editorClasses from '@/components/proposal-editor/proposal-editor.module.css';
import headerClasses from '@/components/proposal-header/proposal-header.module.css';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const ProposalHistory = () => {
  const { id, version: versionNumber } = useParams<{ id: string; version?: string }>();
  const [isDiffsVisible, setIsDiffsVisible] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const proposal = useProposal(Number(id));
  const proposalVersions = useProposalVersions(Number(id));

  useEffect(() => {
    if (versionNumber) {
      setActiveVersion(Number(versionNumber));
    } else {
      // if no version number in url, set active version to latest
      setActiveVersion(proposalVersions?.length ?? 0);
    }
  }, [versionNumber, proposalVersions]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  const highlightSyntax = (markdownText: string) => {
    return (
      <ReactMarkdown
        className={cn(editorClasses.markdown, editorClasses.diffs)}
        remarkPlugins={[remarkBreaks]}
      >
        {markdownText}
      </ReactMarkdown>
    );
  };
  const headerDiffs = (str: string) => {
    return (
      <h1 className="mt-4 font-londrina text-[1.7rem] text-[var(--brand-gray-light-text)]">
        {str}
      </h1>
    );
  };

  return (
    <Section fullWidth={false} className="[&_a]:text-[var(--brand-dark-red)]">
      <div className="mx-auto">
        {proposal && (
          <>
            <div className={headerClasses.backButtonWrapper}>
              <Link to={`/vote/${id}`}>
                <button
                  type="button"
                  className={cn(
                    headerClasses.backButton,
                    'border border-[rgba(0,0,0,0.1)] bg-white text-[rgb(95,95,95)] hover:bg-[#e2e3e8] hover:text-black',
                  )}
                >
                  ←
                </button>
              </Link>
            </div>
            <div className={headerClasses.headerRow}>
              <span>
                <div className="d-flex">
                  <div>
                    <Trans>Proposal {i18n.number(Number(proposal.id || '0'))}</Trans>
                  </div>
                  <div>
                    <ProposalStatus
                      status={proposal?.status}
                      className={headerClasses.proposalStatus}
                    />
                  </div>
                </div>
              </span>
              <div className={headerClasses.proposalTitleWrapper}>
                <div className={cn(headerClasses.proposalTitle, classes.proposalTitle)}>
                  {isDiffsVisible && proposalVersions && activeVersion >= 2 ? (
                    <div className={classes.diffsWrapper}>
                      <ReactDiffViewer
                        oldValue={proposalVersions[activeVersion - 2].title}
                        newValue={proposalVersions[activeVersion - 1].title}
                        splitView={false}
                        hideLineNumbers={true}
                        extraLinesSurroundingDiff={10000}
                        renderContent={headerDiffs}
                        disableWordDiff={false}
                        showDiffOnly={false}
                      />
                    </div>
                  ) : (
                    <h1>
                      {proposalVersions &&
                        activeVersion &&
                        proposalVersions[activeVersion - 1].title}{' '}
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={cn('mt-4 bg-white', 'mx-auto')}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-12 lg:col-span-8">
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
              <div className="[&_table:first-of-type]:ml-[-10px] min-[992px]:[&_table:first-of-type]:ml-[-30px]">
                <div className={cn('col-span-12', 'break-words pt-8 mt-8', 'm-0 p-0')}>
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
                  disableWordDiff={true}
                  showDiffOnly={false}
                />
                <div className="grid grid-cols-12 gap-3">
                  <div className={cn('col-span-12', 'break-words pt-8 mt-8')}>
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
          <div className="col-span-12 md:col-span-12 lg:col-span-4">
            <div className="sticky top-[20px] max-[992px]:relative">
              <div className="mb-4 flex items-baseline justify-between">
                <h2>Version History</h2>
              </div>
              <div className="flex flex-col gap-[10px] text-[var(--brand-gray-light-text)]">
                {proposalVersions &&
                  proposalVersions
                    .map((version, i) => {
                      return (
                        <VersionTab
                          key={i}
                          id={Number(id).toString()}
                          createdAt={Number(version.createdAt)}
                          updateMessage={version.updateMessage}
                          versionNumber={version.versionNumber}
                          isActive={i + 1 === activeVersion}
                          setActiveVersion={setActiveVersion}
                        />
                      );
                    })
                    .reverse()}
              </div>
              {activeVersion > 1 && (
                <button
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

export default ProposalHistory;
