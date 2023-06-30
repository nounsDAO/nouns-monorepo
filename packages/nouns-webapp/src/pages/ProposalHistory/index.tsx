import { Row, Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useProposal, useProposalVersions } from '../../wrappers/nounsDao';
import classes from './Vote.module.css';
import editorClasses from '../../components/ProposalEditor/ProposalEditor.module.css';
import { RouteComponentProps, } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import ProposalHeader from '../../components/ProposalHeader';
import ProposalContent from '../../components/ProposalContent';
import ReactDiffViewer from 'react-diff-viewer';
import ReactMarkdown from 'react-markdown';
import { Trans } from '@lingui/macro';
import VersionTab from './VersionTab';
import remarkBreaks from 'remark-breaks';
import ProposalTransactions from '../../components/ProposalContent/ProposalTransactions';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const ProposalHistory = ({
  match: {
    params: { id, versionNumber },
  },
}: RouteComponentProps<{ id: string; versionNumber?: string }>) => {
  const [isDiffsVisible, setIsDiffsVisible] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const proposal = useProposal(id);
  const proposalVersions = useProposalVersions(id);
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  useEffect(() => {
    if (versionNumber) {
      setActiveVersion(parseInt(versionNumber));
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

  const isWalletConnected = !(activeAccount === undefined);
  const highlightSyntax = (str: string) => {
    return (
      <ReactMarkdown
        className={clsx(editorClasses.markdown, editorClasses.diffs)}
        children={str}
        remarkPlugins={[remarkBreaks]}
      />
    );
  };

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={12} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            title={
              proposalVersions
                ? proposalVersions[activeVersion > 0 ? activeVersion - 1 : activeVersion].title
                : proposal.title
            }
            proposal={proposal}
            isActiveForVoting={false}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => null}
          />
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
                  isV3Proposal={true}
                />
              )}
            {isDiffsVisible && proposalVersions && activeVersion >= 2 && (
              <div className={classes.diffsWrapper}>
                <ReactDiffViewer
                  oldValue={proposalVersions[activeVersion - 2].description}
                  newValue={proposalVersions[activeVersion - 1].description}
                  splitView={false}
                  hideLineNumbers={true}
                  extraLinesSurroundingDiff={10000}
                  renderContent={highlightSyntax}
                />
                <Row>
                  <Col className={classes.section}>
                    <h5>
                      <Trans>Proposed Transactions</Trans>
                    </h5>
                    <p>Version {activeVersion}</p>
                    <ProposalTransactions details={proposalVersions[activeVersion - 1].details} />

                    <p>Version {activeVersion - 1}</p>
                    <ProposalTransactions details={proposalVersions[activeVersion - 2].details} />
                  </Col>
                </Row>
              </div>
            )}
          </Col>
          <Col lg={4} md={12}>
            <div className={classes.versionHistory}>
              <div className={classes.versionHistoryHeader}>
                <h2>Version History</h2>
                <button
                  className={classes.diffsLink}
                  onClick={() => setIsDiffsVisible(!isDiffsVisible)}
                >
                  View diffs
                </button>
              </div>
              <div className={classes.versionsList}>
                {proposalVersions &&
                  proposalVersions
                    .map((version, i) => {
                      return (
                        <VersionTab
                          key={i}
                          id={id}
                          createdAt={version.createdAt}
                          updateMessage={version.updateMessage}
                          versionNumber={version.versionNumber}
                          isActive={i + 1 === activeVersion ? true : false}
                          setActiveVersion={setActiveVersion}
                        />
                      );
                    })
                    .reverse()}
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default ProposalHistory;