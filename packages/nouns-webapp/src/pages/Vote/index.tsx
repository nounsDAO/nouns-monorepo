import { Row, Col, Alert, Button, Card, ProgressBar, Spinner, Container } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useCastVote,
  useExecuteProposal,
  useHasVotedOnProposal,
  useProposal,
  useQueueProposal,
  Vote,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TransactionStatus, useBlockNumber } from '@usedapp/core';
import { buildEtherscanAddressLink, buildEtherscanTxLink } from '../../utils/etherscan';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalStatus from '../../components/ProposalStatus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import VoteModal from '../../components/VoteModal';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { utils } from 'ethers';
import { useAppDispatch } from '../../hooks';
import StandaloneNoun from '../../components/StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const AVERAGE_BLOCK_TIME_IN_SECS = 13;

const VotePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const proposal = useProposal(id);

  const [vote, setVote] = useState<Vote>();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [isVotePending, setVotePending] = useState<boolean>(false);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const { castVote, castVoteState } = useCastVote();
  const { queueProposal, queueProposalState } = useQueueProposal();
  const { executeProposal, executeProposalState } = useExecuteProposal();

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;
  const now = dayjs();

  // Get total votes and format percentages for UI
  const totalVotes = proposal
    ? proposal.forCount + proposal.againstCount + proposal.abstainCount
    : undefined;
  const forPercentage = proposal && totalVotes ? (proposal.forCount * 100) / totalVotes : 0;
  const againstPercentage = proposal && totalVotes ? (proposal.againstCount * 100) / totalVotes : 0;
  const abstainPercentage = proposal && totalVotes ? (proposal.abstainCount * 100) / totalVotes : 0;

  const proposalActive = proposal?.status === ProposalState.ACTIVE;

  // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  const hasVoted = useHasVotedOnProposal(proposal?.id);

  const showBlockRestriction = proposalActive;

  // Only show voting if user has > 0 votes at proposal created block and proposal is active
  const showVotingButtons = availableVotes && !hasVoted && proposalActive;

  const linkIfAddress = (content: string) => {
    if (utils.isAddress(content)) {
      return (
        <a href={buildEtherscanAddressLink(content)} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }
    return <span>{content}</span>;
  };

  const transactionLink = (content: string) => {
    return (
      <a href={buildEtherscanTxLink(content)} target="_blank" rel="noreferrer">
        {content.substring(0, 7)}
      </a>
    );
  };

  const getVoteErrorMessage = (error: string | undefined) => {
    if (error?.match(/voter already voted/)) {
      return 'User Already Voted';
    }
    return error;
  };

  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    }
    return false;
  };

  const { forCount = 0, againstCount = 0, quorumVotes = 0 } = proposal || {};
  const quorumReached = forCount > againstCount && forCount >= quorumVotes;

  const moveStateButtonAction = hasSucceeded ? 'Queue' : 'Execute';
  const moveStateAction = (() => {
    if (hasSucceeded) {
      return () => queueProposal(proposal?.id);
    }
    return () => executeProposal(proposal?.id);
  })();

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
      onFinalState?: () => void,
    ) => {
      switch (tx.status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          setModal({
            title: 'Success',
            message: successMessage || 'Transaction Successful!',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          setModal({
            title: 'Transaction Failed',
            message: tx?.errorMessage || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          setModal({
            title: 'Error',
            message: getErrorMessage?.(tx?.errorMessage) || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [setModal],
  );

  useEffect(
    () =>
      onTransactionStateChange(
        castVoteState,
        'Vote Successful!',
        setVotePending,
        getVoteErrorMessage,
        () => setShowVoteModal(false),
      ),
    [castVoteState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(queueProposalState, 'Proposal Queued!', setQueuePending),
    [queueProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(executeProposalState, 'Proposal Executed!', setExecutePending),
    [executeProposalState, onTransactionStateChange, setModal],
  );

  return (
    <Container fluid="lg">
       {/* <Row className={classes.headerRow} style={{marginBottom: '0rem'}}> */}
     <Row className={classes.headerRow} style={{marginBottom: '0rem'}}>
        <Col lg={10} style={{ marginBottom: '0rem'}} className={classes.headerRow}>
            <span>Proposal #{proposal && proposal.id}</span>
        </Col>
      </Row>
      <Row>

           <Col lg={5} className={classes.headerRow} style={{
             margin: '2rem 0',
             marginTop: '0rem',
             marginLeft: '0rem',
             paddingLeft: '1.5rem'
           }}>
                <h1>{proposal && proposal.title}</h1>
           </Col>
           <Col lg={1} style={{
             margin: '2rem 0',
             marginTop: '0rem',
             marginLeft: '0rem',
             paddingTop: '.5rem'
           }}>
            <ProposalStatus status={proposal && proposal.status} /> 
           </Col>
           <Col lg={4}>
             <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{
              fontFamily: 'PT Root UI Bold', 
              color: '#8C8D92',
              fontSize: '16px',
              marginTop: '.7rem'
            }}>Connect a wallet to vote.</span>
              <Button
                  onClick={() => {
                    console.log("hi there")
                  }}
                  className={classes.generateBtn}
                >
                  Submit vote
                </Button>
             </div>
           </Col>
      </Row>
      <Row>
        <Col style={{border: '1px #E2E3E8 solid', borderRadius: '12px', marginRight: '1rem', marginLeft: '1rem', padding: '1rem', minWidth: '18rem'}} >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    fontFamily: 'Londrina Solid',
                    fontSize: '24px',
                    color: '#43B369'
                  }}>
                    For 
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontFamily: 'PT Root UI Bold'
                  }}>
                    {proposal?.forCount}
                  </div>
                </div>
              <ProgressBar variant="success" now={forPercentage} />
              <Row>
                {/* Maybe make this a table instead */}
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
                <Col style={{margin: '0rem', backgroundColor: 'red'}} sm={3}>
                  <div style={{height: '64px', width: '64px'}}>
                    <StandaloneNoun nounId={EthersBN.from(69)} />
                  </div>
                </Col>
               
               
                
              </Row>
        </Col>
        <Col style={{border: '1px #E2E3E8 solid', borderRadius: '12px', marginRight: '1rem', padding: '1rem', minWidth: '18rem'}} >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    fontFamily: 'Londrina Solid',
                    fontSize: '24px',
                    color: '#8C8D92'
                  }}>
                    Aginst 
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontFamily: 'PT Root UI Bold'
                  }}>
                    {proposal?.againstCount}
                  </div>
                </div>
                <ProgressBar variant="danger" now={againstPercentage} />
        </Col>
        <Col style={{border: '1px #E2E3E8 solid', borderRadius: '12px', marginRight: '1rem', padding: '1rem', minWidth: '18rem' }} >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    fontFamily: 'Londrina Solid',
                    fontSize: '24px',
                    color: '#D63C5E'
                  }}>
                    Abstain 
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontFamily: 'PT Root UI Bold'
                  }}>
                    {proposal?.abstainCount}
                  </div>
                </div>
                <ProgressBar variant="info" now={abstainPercentage} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} style={{margin: '2rem 0'}}>
        {proposal?.description && (
                <ReactMarkdown
                  className={classes.markdown}
                  children={proposal.description}
                  remarkPlugins={[remarkBreaks]}
                />
              )}
          </Col>
      </Row>

    </Container>
  );
};

export default VotePage;
