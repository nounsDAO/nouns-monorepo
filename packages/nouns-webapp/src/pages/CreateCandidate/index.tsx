/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Alert, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { withStepProgress } from 'react-stepz';
import { toast } from 'sonner';
import { formatEther } from 'viem';

import CreateCandidateButton from '@/components/CreateCandidateButton';
import ProposalActionModal, {
  getProposalActionModalStateFromTransaction,
  ProposalActionModalState,
} from '@/components/ProposalActionsModal';
import ProposalEditor from '@/components/ProposalEditor';
import ProposalTransactions from '@/components/ProposalTransactions';
import TokenBuyerTopUpAlert from '@/components/TokenBuyerTopUpAlert';
import { nounsTokenBuyerAddress } from '@/contracts';
import Section from '@/layout/Section';
import { useEthNeeded } from '@/utils/tokenBuyerContractUtils/tokenBuyer';
import { Hex } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { ProposalTransaction, useProposalThreshold } from '@/wrappers/nounsDao';
import { useCreateProposalCandidate, useGetCreateCandidateCost } from '@/wrappers/nounsData';
import { useUserVotes } from '@/wrappers/nounToken';

import classes from '../CreateProposal/CreateProposal.module.css';

import navBarButtonClasses from '@/components/NavBarButton/NavBarButton.module.css';

const CreateCandidatePage = () => {
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [slug, setSlug] = useState('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [includeTokenBuyerTopUp, setIncludeTokenBuyerTopUp] = useState(false);
  const [isTokenBuyerTopUpManuallyEdited, setIsTokenBuyerTopUpManuallyEdited] = useState(false);
  const { createProposalCandidate, createProposalCandidateState } = useCreateProposalCandidate();
  const availableVotes = useUserVotes();
  const proposalThreshold = useProposalThreshold();
  const chainId = defaultChain.id;
  const ethNeeded = useEthNeeded(
    nounsTokenBuyerAddress[chainId],
    totalUSDCPayment,
    nounsTokenBuyerAddress[chainId] == undefined || totalUSDCPayment === 0,
  );
  const createCandidateCost = useGetCreateCandidateCost();
  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [editingTransactionIndex, setEditingTransactionIndex] = useState<number>();
  const [editingTransactionState, setEditingTransactionState] =
    useState<ProposalActionModalState>();
  const [isProposePending, setProposePending] = useState(false);
  const { _ } = useLingui();

  const hasVotes = availableVotes && availableVotes > 0;

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

  const handleSaveProposalAction = useCallback(
    (transactions: ProposalTransaction | ProposalTransaction[]) => {
      if (editingTransactionIndex === undefined) {
        handleAddProposalAction(transactions);
        return;
      }

      const transactionsArray = Array.isArray(transactions) ? transactions : [transactions];
      transactionsArray.forEach(transaction => {
        if (!transaction.address.startsWith('0x')) {
          transaction.address = `0x${transaction.address}`;
        }
        if (!transaction.calldata.startsWith('0x')) {
          transaction.calldata = `0x${transaction.calldata}`;
        }
      });

      const previousUSDCValue = proposalTransactions[editingTransactionIndex]?.usdcValue ?? 0;
      const nextUSDCValue = transactionsArray.reduce(
        (total, txn) => total + (txn.usdcValue ?? 0),
        0,
      );
      const editedTransaction = proposalTransactions[editingTransactionIndex];
      const isEditingTokenBuyerTopUp =
        editedTransaction?.address.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase();
      setTotalUSDCPayment(totalUSDCPayment - previousUSDCValue + nextUSDCValue);
      setProposalTransactions([
        ...proposalTransactions.slice(0, editingTransactionIndex),
        ...transactionsArray,
        ...proposalTransactions.slice(editingTransactionIndex + 1),
      ]);
      if (isEditingTokenBuyerTopUp) {
        const tokenBuyerTopUp = transactionsArray.find(
          txn => txn.address.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase(),
        );
        setIncludeTokenBuyerTopUp(true);
        setTokenBuyerTopUpETH(String(tokenBuyerTopUp?.value ?? 0n));
        setIsTokenBuyerTopUpManuallyEdited(true);
      }
      setEditingTransactionIndex(undefined);
      setEditingTransactionState(undefined);
      setShowTransactionFormModal(false);
    },
    [
      chainId,
      editingTransactionIndex,
      handleAddProposalAction,
      proposalTransactions,
      totalUSDCPayment,
    ],
  );

  const handleEditProposalAction = useCallback(
    (index: number) => {
      const transaction = proposalTransactions[index];
      if (transaction?.address.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase()) {
        setIncludeTokenBuyerTopUp(true);
      }
      setEditingTransactionIndex(index);
      setEditingTransactionState(getProposalActionModalStateFromTransaction(transaction));
      setShowTransactionFormModal(true);
    },
    [chainId, proposalTransactions],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      const removedTransaction = proposalTransactions[index];
      if (
        removedTransaction?.address.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase()
      ) {
        setIncludeTokenBuyerTopUp(false);
        setTokenBuyerTopUpETH('0');
        setIsTokenBuyerTopUpManuallyEdited(false);
      }
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [chainId, proposalTransactions, totalUSDCPayment],
  );

  useEffect(() => {
    if (!includeTokenBuyerTopUp || totalUSDCPayment === 0) {
      if (tokenBuyerTopUpEth !== '0') {
        setProposalTransactions(
          proposalTransactions.filter(
            txn => txn.address.toLowerCase() !== nounsTokenBuyerAddress[chainId].toLowerCase(),
          ),
        );
        setTokenBuyerTopUpETH('0');
        setIsTokenBuyerTopUpManuallyEdited(false);
      }
      return;
    }

    if (isTokenBuyerTopUpManuallyEdited) {
      return;
    }

    if (ethNeeded !== undefined && ethNeeded !== tokenBuyerTopUpEth && totalUSDCPayment > 0) {
      const hasTokenBuyerTopTop =
        proposalTransactions.filter(txn => txn.address === nounsTokenBuyerAddress[chainId]).length >
        0;

      // Add a new top-up txn if one isn't there already, else add to the existing one
      if (Number(ethNeeded) > 0 && !hasTokenBuyerTopTop) {
        handleAddProposalAction({
          address: nounsTokenBuyerAddress[chainId],
          value: BigInt(ethNeeded ?? 0),
          calldata: '0x' as Hex,
          signature: '',
        });
      } else {
        if (Number(ethNeeded) > 0) {
          const indexOfTokenBuyerTopUp =
            proposalTransactions
              .map((txn, index: number) => {
                if (txn.address === nounsTokenBuyerAddress[chainId]) {
                  return index;
                } else {
                  return -1;
                }
              })
              .filter(n => n >= 0) ?? new Array<number>();

          const transactionsList = proposalTransactions;
          if (indexOfTokenBuyerTopUp.length > 0) {
            transactionsList[indexOfTokenBuyerTopUp[0]].value = BigInt(ethNeeded);
            setProposalTransactions(transactionsList);
          }
        }
      }

      setTokenBuyerTopUpETH(ethNeeded ?? '0');
    }
  }, [
    chainId,
    ethNeeded,
    handleAddProposalAction,
    handleRemoveProposalAction,
    includeTokenBuyerTopUp,
    isTokenBuyerTopUpManuallyEdited,
    proposalTransactions,
    tokenBuyerTopUpEth,
    totalUSDCPayment,
  ]);

  const handleTitleInput = useCallback(
    (title: string) => {
      setTitleValue(title);
      setSlug(
        title
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      );
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
    [titleValue, bodyValue, proposalTransactions.length],
  );

  const handleCreateProposal = async () => {
    await createProposalCandidate({
      args: [
        proposalTransactions.map(({ address }) => address as `0x${string}`), // Targets
        proposalTransactions.map(({ value }) => BigInt(value ?? '0')), // Values
        proposalTransactions.map(({ signature }) => signature), // Signatures
        proposalTransactions.map(({ calldata }) => calldata as `0x${string}`), // Calldatas
        `# ${titleValue}\n\n${bodyValue}`, // Description
        slug, // Slug
        0n, // proposalIdToUpdate - use 0 for new proposals
      ],
      value: hasVotes ? 0n : createCandidateCost, // Fee for non-nouners
    });
  };

  useEffect(() => {
    switch (createProposalCandidateState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        toast.success(_(t`Candidate Created!`));
        setProposePending(false);
        break;
      case 'Fail':
      case 'Exception':
        toast.error(createProposalCandidateState?.errorMessage || _(t`Please try again.`));
        setProposePending(false);
        break;
    }
  }, [createProposalCandidateState, _]);

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalActionModal
        onDismiss={() => {
          setShowTransactionFormModal(false);
          setEditingTransactionIndex(undefined);
          setEditingTransactionState(undefined);
        }}
        show={showTransactionFormModal}
        onActionAdd={handleSaveProposalAction}
        initialState={editingTransactionState}
        isEditing={editingTransactionIndex !== undefined}
      />

      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <div className={classes.wrapper}>
          <Link to={'/vote#candidates'}>
            <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
          </Link>
          <h3 className={classes.heading}>
            <Trans>Create Proposal Candidate</Trans>
          </h3>
        </div>

        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <Trans>
            Proposal candidates can be created by anyone. If a candidate receives enough signatures
            by Nouns voters, it can be promoted to a proposal.{' '}
          </Trans>
          <br />
          <br />

          <strong>
            <Trans>
              Submissions are free for Nouns voters. Non-voters can submit for a{' '}
              {createCandidateCost ? formatEther(createCandidateCost) : '0'} ETH fee.
            </Trans>
          </strong>
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
          onEditProposalTransaction={handleEditProposalAction}
        />
        {totalUSDCPayment > 0 && (
          <TokenBuyerTopUpAlert
            className={classes.tokenBuyerNotif}
            includeTokenBuyerTopUp={includeTokenBuyerTopUp}
            onIncludeTokenBuyerTopUpChange={include => {
              setIncludeTokenBuyerTopUp(include);
              setIsTokenBuyerTopUpManuallyEdited(false);
            }}
            suggestedEth={ethNeeded}
            topUpEth={tokenBuyerTopUpEth}
          />
        )}
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
          isCandidate={true}
        />
        <CreateCandidateButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold ?? undefined}
          hasActiveOrPendingProposal={false} // not needed for candidates
          isFormInvalid={isFormInvalid}
          handleCreateProposal={handleCreateProposal}
        />
        <p className={classes.feeNotice}>
          {!hasVotes && (
            <Trans>
              {createCandidateCost ? formatEther(createCandidateCost) : '0'} ETH fee upon submission
            </Trans>
          )}
        </p>
      </Col>
    </Section>
  );
};

export default withStepProgress(CreateCandidatePage);
