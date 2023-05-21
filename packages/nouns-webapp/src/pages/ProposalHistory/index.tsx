import { Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useCancelProposal,
  useCurrentQuorum,
  useExecuteProposal,
  useProposal,
  useProposalVersions,
  useQueueProposal,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import editorClasses from '../../components/ProposalEditor/ProposalEditor.module.css';
import { RouteComponentProps, useParams, useRouteMatch } from 'react-router-dom';
import { TransactionStatus, useBlockNumber, useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import VoteModal from '../../components/VoteModal';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import clsx from 'clsx';
import ProposalHeader from '../../components/ProposalHeader';
import ProposalContent from '../../components/ProposalContent';
import ReactDiffViewer from 'react-diff-viewer';
import ReactMarkdown from 'react-markdown';
import VoteCard, { VoteCardVariant } from '../../components/VoteCard';
import { useQuery } from '@apollo/client';
import {
  proposalVotesQuery,
  delegateNounsAtBlockQuery,
  ProposalVotes,
  Delegates,
  propUsingDynamicQuorum,
} from '../../wrappers/subgraph';
import { getNounVotes } from '../../utils/getNounsVotes';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import { SearchIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import DynamicQuorumInfoModal from '../../components/DynamicQuorumInfoModal';
import config from '../../config';
import ShortAddress from '../../components/ShortAddress';
import StreamWithdrawModal from '../../components/StreamWithdrawModal';
import { parseStreamCreationCallData } from '../../utils/streamingPaymentUtils/streamingPaymentUtils';
import VersionTab from './VersionTab';
import remarkBreaks from 'remark-breaks';
import ProposalTransactions from '../../components/ProposalContent/ProposalTransactions';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

interface MatchParams {
  id: string;
}

const ProposalHistory = ({
  match: {
    params: { id, versionNumber },
  },
}: RouteComponentProps<{ id: string; versionNumber?: string }>) => {
  const proposal = useProposal(id);
  const proposalVersions = useProposalVersions(id);
  const [isDiffsVisible, setIsDiffsVisible] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);
  const [earlierVersion, setEarlierVersion] = useState(0);

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();

  console.log('proposalVersions', proposalVersions);

  useEffect(() => {
    if (versionNumber) {
      setActiveVersion(parseInt(versionNumber));
    } else {
      // if no version number in url, set active version to latest
      setActiveVersion(proposalVersions?.length ?? 0);
      if (proposalVersions && proposalVersions?.length > 1) {
        setEarlierVersion(proposalVersions.length - 1);
      }
    }
  }, [versionNumber, proposalVersions]);

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const [showToast, setShowToast] = useState(true);
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
      />);
  };

  console.log('activeVersion', activeVersion);

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={12} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            title={proposalVersions ? proposalVersions[activeVersion > 0 ? activeVersion - 1 : activeVersion].title : proposal.title}
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
            {((!isDiffsVisible && proposalVersions && activeVersion) || (isDiffsVisible && proposalVersions && activeVersion < 2)) && (
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
                    <p>Version {activeVersion - 1}</p>
                    <ProposalTransactions details={proposalVersions[activeVersion - 1].details} />

                    <p>Version {activeVersion - 2}</p>
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
                          version={version}
                          key={i}
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
