import { Col, Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalTransaction,
  ProposalDetail,
  useProposal,
  useProposalThreshold,
  usePropose,
  useUpdateProposal,
} from '../../wrappers/nounsDao';
import classes from '../CreateProposal/CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
import EditProposalButton from '../../components/EditProposalButton/index';
import ProposalTransactions from '../../components/ProposalTransactions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import navBarButtonClasses from '../../components/NavBarButton/NavBarButton.module.css';
import ProposalActionModal from '../../components/ProposalActionsModal';
import config from '../../config';
import { useEthNeeded } from '../../utils/tokenBuyerContractUtils/tokenBuyer';

interface EditProposalProps {
  isCandidate?: boolean;
  match: {
    params: { id: string };
  };
}

const EditProposalPage: React.FC<EditProposalProps> = props => {
  const [isProposalEdited, setIsProposalEdited] = useState(false);
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);
  const proposal = useProposal(props.match.params.id, true);
  const proposalThreshold = useProposalThreshold();
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const { account } = useEthers();
  const { propose, proposeState } = usePropose();
  const { updateProposal, updateProposalState } = useUpdateProposal();
  const ethNeeded = useEthNeeded(
    config.addresses.tokenBuyer ?? '',
    totalUSDCPayment,
    config.addresses.tokenBuyer === undefined || totalUSDCPayment === 0,
  );

  const removeTitleFromDescription = (description: string, title: string) => {
    const titleRegex = new RegExp(`# ${title}\n\n`);
    return description.replace(titleRegex, '');
  };

  const handleAddProposalAction = useCallback(
    (transactions: ProposalTransaction | ProposalTransaction[]) => {
      const transactionsArray = Array.isArray(transactions) ? transactions : [transactions];

      transactionsArray.forEach(transaction => {
        if (!transaction.address.startsWith('0x')) {
          transaction.address = `0x${transaction.address}`;
        }
        if (!transaction.calldata.startsWith('0x')) {
          transaction.calldata = `0x${transaction.calldata}`;
        }

        if (transaction.usdcValue) {
          setTotalUSDCPayment(totalUSDCPayment + transaction.usdcValue);
        }
      });
      setProposalTransactions([...proposalTransactions, ...transactionsArray]);

      setShowTransactionFormModal(false);
    },
    [proposalTransactions, totalUSDCPayment],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [proposalTransactions, totalUSDCPayment],
  );

  useEffect(() => {
    if (ethNeeded !== undefined && ethNeeded !== tokenBuyerTopUpEth && totalUSDCPayment > 0) {
      const hasTokenBuyterTopTop =
        proposalTransactions.filter(txn => txn.address === config.addresses.tokenBuyer).length > 0;

      // Add a new top up txn if one isn't there already, else add to the existing one
      if (parseInt(ethNeeded) > 0 && !hasTokenBuyterTopTop) {
        handleAddProposalAction({
          address: config.addresses.tokenBuyer ?? '',
          value: ethNeeded ?? '0',
          calldata: '0x',
          signature: '',
        });
      } else {
        if (parseInt(ethNeeded) > 0) {
          const indexOfTokenBuyerTopUp =
            proposalTransactions
              .map((txn, index: number) => {
                if (txn.address === config.addresses.tokenBuyer) {
                  return index;
                } else {
                  return -1;
                }
              })
              .filter(n => n >= 0) ?? new Array<number>();
          const txns = proposalTransactions;
          if (indexOfTokenBuyerTopUp.length > 0) {
            txns[indexOfTokenBuyerTopUp[0]].value = ethNeeded;
            setProposalTransactions(txns);
          }
        }
      }
      setTokenBuyerTopUpETH(ethNeeded ?? '0');
    }
  }, [
    ethNeeded,
    handleAddProposalAction,
    handleRemoveProposalAction,
    proposalTransactions,
    tokenBuyerTopUpEth,
    totalUSDCPayment,
  ]);

  const handleTitleInput = useCallback(
    (title: string) => {
      setTitleValue(title);
      if (title === proposal?.title) {
        setIsProposalEdited(false);
      } else {
        setIsProposalEdited(true);
      }
    },
    [setTitleValue, titleValue],
  );

  const handleBodyInput = useCallback(
    (body: string) => {
      setBodyValue(body);
      if (body === proposal?.description) {
        setIsProposalEdited(false);
      } else {
        setIsProposalEdited(true);
      }
    },
    [setBodyValue, bodyValue],
  );

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

  useEffect(() => {
    switch (updateProposalState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Proposal Updated!</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: updateProposalState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: updateProposalState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [updateProposalState, setModal]);

  const handleUpdateProposal = async () => {
    if (!proposalTransactions?.length) return;
    if (proposal === undefined) return;
    await updateProposal(
      proposal.id, // proposalId
      proposalTransactions.map(({ address }) => address), // Targets
      proposalTransactions.map(({ value }) => value ?? '0'), // Values
      proposalTransactions.map(({ signature }) => signature ?? ''), // Signatures
      proposalTransactions.map(({ calldata }) => calldata), // Calldatas
      `# ${titleValue}\n\n${bodyValue}`, // Description
      commitMessage,
    );
  };

  const [originalTitleValue, setOriginalTitleValue] = useState('');
  const [originalBodyValue, setOriginalBodyValue] = useState('');
  const [originalProposalTransactions, setOriginalProposalTransactions] = useState<
    ProposalDetail[]
  >([]);

  // set initial values on page load and as they're changed
  useEffect(() => {
    if (proposal) {
      const transactions = proposal.details.map(txn => {
        return {
          address: txn.target,
          value: txn.value ?? '0',
          calldata: txn.callData,
          signature: txn.functionSig,
        };
      });
      setTitleValue(proposal.title);
      setBodyValue(removeTitleFromDescription(proposal.description, proposal.title));
      setProposalTransactions(transactions);
      setOriginalTitleValue(proposal.title);
      setOriginalBodyValue(proposal.description);
      setOriginalProposalTransactions(proposal.details);
    }
  }, [proposal?.title, proposal?.description, proposal?.details.length]);

  const checkIsProposalEdited = () => {
    if (proposal) {
      if (originalTitleValue !== titleValue) {
        return true;
      }
      if (originalBodyValue !== bodyValue) {
        return true;
      }
      if (originalProposalTransactions.length !== proposalTransactions.length) {
        return true;
      }
      for (let i = 0; i < originalProposalTransactions.length; i++) {
        if (
          originalProposalTransactions[i].target !== proposalTransactions[i].address ||
          originalProposalTransactions[i].value !== proposalTransactions[i].value
        ) {
          return true;
        }
      }
    }
    return false;
  };

  if (proposal?.proposer?.toLowerCase() !== account?.toLowerCase()) {
    return null;
  }

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalActionModal
        onDismiss={() => setShowTransactionFormModal(false)}
        show={showTransactionFormModal}
        onActionAdd={handleAddProposalAction}
      />
      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <div className={classes.wrapper}>
          <Link to={'/vote'}>
            <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
          </Link>
          <h3 className={classes.heading}>
            <Trans>Edit Proposal</Trans>
          </h3>
        </div>
        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <b>
            <Trans>Note</Trans>
          </b>
          : <Trans>Editing a proposal will clear all previous feedback</Trans>
        </Alert>
        <div className="d-grid">
          <Button
            className={classes.proposalActionButton}
            variant="dark"
            onClick={() => setShowTransactionFormModal(true)}
          >
            <Trans>Add Action</Trans>
          </Button>
        </div>
        <ProposalTransactions
          proposalTransactions={proposalTransactions}
          onRemoveProposalTransaction={handleRemoveProposalAction}
        />

        {totalUSDCPayment > 0 && (
          <Alert variant="secondary" className={classes.tokenBuyerNotif}>
            <b>
              <Trans>Note</Trans>
            </b>
            :{' '}
            <Trans>
              Because this proposal contains a USDC fund transfer action we've added an additional
              ETH transaction to refill the TokenBuyer contract. This action allows to DAO to
              continue to trustlessly acquire USDC to fund proposals like this.
            </Trans>
          </Alert>
        )}
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        <InputGroup className={classes.commitMessage}>
          <FormControl
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
            placeholder="Optional commit message"
          />
        </InputGroup>

        <EditProposalButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold}
          hasActiveOrPendingProposal={false} // not relevant for edit
          hasEnoughVote={true}
          isFormInvalid={isProposalEdited ? false : true}
          handleCreateProposal={handleUpdateProposal}
        />
        {props.isCandidate && (
          <p className="text-center">This will clear all previous sponsors and feedback votes</p>
        )}
      </Col>
    </Section>
  );
};

export default EditProposalPage;
