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

  const [activeVersion, setActiveVersion] = useState(0);

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();

  useEffect(() => {
    if (versionNumber) {
      setActiveVersion(parseInt(versionNumber));
    } else {
      // if no version number in url, set active version to latest
      setActiveVersion(proposalVersions?.length ?? 0);
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
  console.log('proposalVersions', proposalVersions);

  return (
    <Section fullWidth={false} className={classes.votePage}>
      <Col lg={10} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            proposal={proposal}
            isActiveForVoting={false}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => null}
          />
        )}
      </Col>
      <Col lg={10} className={clsx(classes.proposal, classes.wrapper)}>
        <Row>
          <Col xl={8} lg={12}>
            {proposalVersions && activeVersion && (
              <ProposalContent
                description={proposalVersions[activeVersion - 1].description}
                title={proposalVersions[activeVersion - 1].title}
                details={proposalVersions[activeVersion - 1].details}
              />
            )}
          </Col>
          <Col xl={4} lg={12}>
            <div className={classes.versionHistory}>
              <h2>Version History</h2>
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
