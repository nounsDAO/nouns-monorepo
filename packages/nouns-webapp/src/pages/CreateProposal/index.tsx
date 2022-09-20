import { Col, Alert, Button } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  ProposalTransaction,
  useProposal,
  useProposalCount,
  useProposalThreshold,
  usePropose,
} from '../../wrappers/nounsDao';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
import CreateProposalButton from '../../components/CreateProposalButton';
import ProposalTransactions from '../../components/ProposalTransactions';
import ProposalTransactionFormModal from '../../components/ProposalTransactionFormModal';
import { withStepProgress } from 'react-stepz';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Trans } from '@lingui/macro';

const CreateProposalPage = () => {
  const { account } = useEthers();
  const latestProposalId = useProposalCount();
  const latestProposal = useProposal(latestProposalId ?? 0);
  const availableVotes = useUserVotes();
  const proposalThreshold = useProposalThreshold();

  const { propose, proposeState } = usePropose();

  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');

  const handleAddProposalAction = useCallback(
    (transaction: ProposalTransaction) => {
      if (!transaction.address.startsWith('0x')) {
        transaction.address = `0x${transaction.address}`;
      }
      if (!transaction.calldata.startsWith('0x')) {
        transaction.calldata = `0x${transaction.calldata}`;
      }
      setProposalTransactions([...proposalTransactions, transaction]);
      setShowTransactionFormModal(false);
    },
    [proposalTransactions],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [proposalTransactions],
  );

  const handleTitleInput = useCallback(
    (title: string) => {
      setTitleValue(title);
    },
    [setTitleValue],
  );

  const handleBodyInput = useCallback(
    (body: string) => {
      setBodyValue(body);
    },
    [setBodyValue],
  );

  const isFormInvalid = useMemo(
    () => !proposalTransactions.length || titleValue === '' || bodyValue === '',
    [proposalTransactions, titleValue, bodyValue],
  );

  const hasEnoughVote = Boolean(
    availableVotes && proposalThreshold !== undefined && availableVotes > proposalThreshold,
  );

  const handleCreateProposal = async () => {
    if (!proposalTransactions?.length) return;

    await propose(
      proposalTransactions.map(({ address }) => address), // Targets
      proposalTransactions.map(({ value }) => value ?? '0'), // Values
      proposalTransactions.map(({ signature }) => signature), // Signatures
      proposalTransactions.map(({ calldata }) => calldata), // Calldatas
      `# ${titleValue}\n\n${bodyValue}`, // Description
    );
  };

  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  useEffect(() => {
    switch (proposeState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Proposal Created!</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: proposeState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: proposeState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [proposeState, setModal]);

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalTransactionFormModal
        show={showTransactionFormModal}
        onHide={() => setShowTransactionFormModal(false)}
        onProposalTransactionAdded={handleAddProposalAction}
      />
      <Col lg={{ span: 8, offset: 2 }}>
        <Link to="/vote">
          ← <Trans>All Proposals</Trans>
        </Link>
      </Col>
      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <h3 className={classes.heading}>
          <Trans>Create Proposal</Trans>
        </h3>
        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <b>
            <Trans>Tip:</Trans>
          </b>
          :
          <Trans>
            Add one or more transactions and describe your proposal for the community. The proposal
            cannot be modified after submission, so please verify all information before submitting.
            The voting period will begin after 2 1/3 days and last for 3 days.
          </Trans>
        </Alert>
        <div className="d-grid">
          <Button
            className={classes.addTransactionButton}
            variant="dark"
            onClick={() => setShowTransactionFormModal(true)}
          >
            <Trans>Add Transaction</Trans>
          </Button>
        </div>
        <ProposalTransactions
          proposalTransactions={proposalTransactions}
          onRemoveProposalTransaction={handleRemoveProposalAction}
        />
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        <CreateProposalButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold}
          hasActiveOrPendingProposal={
            (latestProposal?.status === ProposalState.ACTIVE ||
              latestProposal?.status === ProposalState.PENDING) &&
            latestProposal.proposer === account
          }
          hasEnoughVote={hasEnoughVote}
          isFormInvalid={isFormInvalid}
          handleCreateProposal={handleCreateProposal}
        />
      </Col>
    </Section>
  );
};

export default withStepProgress(CreateProposalPage);
