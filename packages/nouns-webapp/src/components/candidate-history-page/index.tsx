'use client';
import { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Col, Row } from 'react-bootstrap';
import ReactDiffViewer from 'react-diff-viewer';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import ProposalTransactionsDiffs from '@/components/proposal-content/proposal-transactions-diffs';
import Section from '@/layout/Section';
import { processProposalDescriptionText } from '@/utils/processProposalDescriptionText';
import {
  ProposalCandidateVersionContent,
  useCandidateProposalVersions,
} from '@/wrappers/nounsData';
import { Link, useParams } from 'react-router';

import ProposalContent from '../../components/proposal-content';
import VersionTab from '../ProposalHistory/VersionTab';
import classes from '../proposal-history/vote.module.css';

import navBarButtonClasses from '@/components/nav-bar-butto./nav-bar-button.module.css';
import editorClasses from '@/components/proposal-editor/proposal-editor.module.css';
import headerClasses from '@/components/proposal-header/proposal-header.module.css';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const CandidateHistoryPage = () => {
  const { id, versionNumber } = useParams<{ id: string; versionNumber?: string }>();
  const proposal = useCandidateProposalVersions(Number(id).toString());
  const [isDiffsVisible, setIsDiffsVisible] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const proposalVersions = proposal?.data?.versions.reverse();

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

  const highlightSyntax = (str: string) => {
    return (
      <ReactMarkdown
        className={clsx(editorClasses.markdown, editorClasses.diffs)}
        children={str}
        remarkPlugins={[remarkBreaks]}
      />
    );
  };

  const headerDiffs = (str: string) => {
    return <h1 className={classes.titleDiffs}>{str}</h1>;
  };

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={12} className={classes.wrapper}>
        <div className={headerClasses.backButtonWrapper}>
          <Link to={`/candidates/${id}`}>
            <button className={clsx(headerClasses.backButton, navBarButtonClasses.whiteInfo)}>
              ←
            </button>
          </Link>
        </div>
        <div className={headerClasses.headerRow}>
          <span>
            <div className="d-flex">
              <div>
                <Trans>Proposal Candidate</Trans>
              </div>
            </div>
          </span>
          <div className={headerClasses.proposalTitleWrapper}>
            <div className={clsx(headerClasses.proposalTitle, classes.proposalTitle)}>
              {isDiffsVisible && proposalVersions && activeVersion >= 2 ? (
                <div className={classes.diffsWrapper}>
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
                <h1>
                  {proposalVersions
                    ? proposalVersions[activeVersion > 0 ? activeVersion - 1 : activeVersion].title
                    : proposal.data?.title}{' '}
                </h1>
              )}
            </div>
          </div>
        </div>
      </Col>
      <Col lg={12} className={clsx(classes.proposal, classes.wrapper)}>
        <Row>
          <Col lg={8} md={12}>
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
              <div className={classes.diffsWrapper}>
                <Col className={clsx(classes.section, 'm-0 p-0')}>
                  <h5>
                    <Trans>Description</Trans>
                  </h5>
                </Col>
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
                <Row>
                  <Col className={classes.section}>
                    <h5>
                      <Trans>Proposed Transactions</Trans>
                    </h5>
                    <ProposalTransactionsDiffs
                      activeVersionNumber={activeVersion}
                      oldTransactions={proposalVersions[activeVersion - 2].details}
                      newTransactions={proposalVersions[activeVersion - 1].details}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </Col>
          <Col lg={4} md={12}>
            <div className={classes.versionHistory}>
              <div className={classes.versionHistoryHeader}>
                <h2>
                  <Trans>Version History</Trans>
                </h2>
              </div>
              <div className={classes.versionsList}>
                {proposalVersions &&
                  proposalVersions
                    .map((version: ProposalCandidateVersionContent, i: number) => {
                      return (
                        <VersionTab
                          key={i}
                          id={Number(id).toString()}
                          createdAt={version.createdAt}
                          versionNumber={version.versionNumber}
                          updateMessage={version.updateMessage}
                          isActive={i + 1 === activeVersion ? true : false}
                          setActiveVersion={setActiveVersion}
                          isCandidate={true}
                        />
                      );
                    })
                    .reverse()}
              </div>
              {activeVersion > 1 && (
                <button
                  className={classes.diffsLink}
                  onClick={() => setIsDiffsVisible(!isDiffsVisible)}
                >
                  {isDiffsVisible ? 'Hide' : ' View'} diffs
                </button>
              )}
            </div>
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default CandidateHistoryPage;
