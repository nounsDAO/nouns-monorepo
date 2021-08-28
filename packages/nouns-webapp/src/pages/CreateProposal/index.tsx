import { Col, Alert, Button } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useProposal,
  useProposalCount,
  useProposalThreshold,
  usePropose,
} from '../../wrappers/nounsDao';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
import CreateProposalButton from '../../components/CreateProposalButton';
import ProposalTransactionFormModal from '../../components/ProposalTransactionFormModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { utils } from 'ethers';
import { useAppDispatch } from '../../hooks';

interface ProposalTransaction {
  address: string;
  value: string;
  signature: string;
  calldata: string;
}

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
    availableVotes && proposalThreshold && availableVotes > proposalThreshold,
  );

  const handleCreateProposal = async () => {
    if (!proposalTransactions?.length) return;

    await propose({
      targets: proposalTransactions.map(({ address }) => address),
      values: proposalTransactions.map(({ value }) =>
        value ? utils.parseEther(value).toString() : '0',
      ),
      signatures: proposalTransactions.map(({ signature }) => signature),
      calldatas: proposalTransactions.map(({ calldata }) => calldata),
      description: `# ${titleValue}\n\n${bodyValue}`,
    });
  };

  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const linkIfAddress = (content: string, network = Network.mainnet) => {
    if (utils.isAddress(content)) {
      return (
        <a
          href={buildEtherscanAddressLink(content, network).toString()}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      );
    }
    return <span>{content}</span>;
  };

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
          title: 'Success',
          message: 'Proposal Created!',
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: proposeState?.errorMessage || 'Please try again.',
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: proposeState?.errorMessage || 'Please try again.',
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [proposeState, setModal]);

  return (
    <Section bgColor="transparent" fullWidth={false} className={classes.createProposalPage}>
      <ProposalTransactionFormModal
        show={showTransactionFormModal}
        onHide={() => setShowTransactionFormModal(false)}
        onProposalTransactionAdded={handleAddProposalAction}
      />
      <Col lg={{ span: 8, offset: 2 }}>
        <Link to="/vote">← All Proposals</Link>
      </Col>
      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <h3 className={classes.heading}>Create Proposal</h3>
        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <b>Tip</b>: Add one or more transactions and describe your proposal for the community. The
          proposal cannot modified after submission, so please verify all information before
          submitting. The voting period will begin after 2 1/3 days and last for 3 days.
        </Alert>
        <Button
          className={classes.addTransactionButton}
          variant="dark"
          onClick={() => setShowTransactionFormModal(true)}
          block
        >
          Add Transaction
        </Button>
        {/* TODO: Add action detail */}
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        <CreateProposalButton
          className={classes.createProposalButton}
          proposalThreshold={proposalThreshold}
          // TODO: Double check this
          hasActiveOrPendingProposal={
            latestProposal?.status === ProposalState.ACTIVE ||
            latestProposal?.status === ProposalState.PENDING
          }
          hasEnoughVote={hasEnoughVote}
          isFormInvalid={isFormInvalid}
          handleCreateProposal={handleCreateProposal}
        />
      </Col>
    </Section>
  );
};

export default CreateProposalPage;
