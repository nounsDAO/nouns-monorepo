'use client';
import { useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advanced from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Col, Row } from 'react-bootstrap';

import editorClasses from '@/components/ProposalEditor/ProposalEditor.module.css';
import headerClasses from '@/components/ProposalHeader/ProposalHeader.module.css';
import Section from '@/layout/Section';
import { useProposal, useProposalVersions } from '@/wrappers/nounsDao';
import classes from './Vote.module.css';
import navBarButtonClasses from '@/components/NavBarButton/NavBarButton.module.css';
import ProposalContent from '@/components/ProposalContent';

import ReactDiffViewer from 'react-diff-viewer';
import ReactMarkdown from 'react-markdown';

import VersionTab from './VersionTab';

import remarkBreaks from 'remark-breaks';

import ProposalTransactionsDiffs from '@/components/ProposalContent/ProposalTransactionsDiffs';
import ProposalStatus from '@/components/ProposalStatus';
import { processProposalDescriptionText } from '@/utils/processProposalDescriptionText';

import { Link, useParams } from 'react-router';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const ProposalHistory = () => {
  const { id, versionNumber } = useParams<{ id: string; versionNumber?: string }>();
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
        {proposal && (
          <>
            <div className={headerClasses.backButtonWrapper}>
              <Link to={`/vote/${id}`}>
                <button className={clsx(headerClasses.backButton, navBarButtonClasses.whiteInfo)}>
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
                  disableWordDiff={true}
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
                <h2>Version History</h2>
              </div>
              <div className={classes.versionsList}>
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
                  className={clsx(
                    classes.diffsLink,
                    isDiffsVisible ? classes.diffsLinkActive : classes.diffsLinkInactive,
                  )}
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

export default ProposalHistory;
