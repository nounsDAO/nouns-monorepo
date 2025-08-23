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
import ProposalActionModal from '@/components/ProposalActionsModal';
import ProposalEditor from '@/components/ProposalEditor';
import ProposalTransactions from '@/components/ProposalTransactions';
import { nounsTokenBuyerAddress } from '@/contracts';
import Section from '@/layout/Section';
import { useEthNeeded } from '@/utils/tokenBuyerContractUtils/tokenBuyer';
import { Hex } from '@/utils/types';
import { formatTxErrorMessage } from '@/utils/txErrorMessages';
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
  const { createProposalCandidate, createProposalCandidateState } = useCreateProposalCandidate();
  const availableVotes = useUserVotes();
  const proposalThreshold = useProposalThreshold();
  const chainId = defaultChain.id;
  const ethNeeded = useEthNeeded(nounsTokenBuyerAddress[chainId], totalUSDCPayment);
  const createCandidateCost = useGetCreateCandidateCost();
  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
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

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [proposalTransactions, totalUSDCPayment],
  );

  useEffect(() => {
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
        toast.error(
          formatTxErrorMessage(createProposalCandidateState?.errorMessage || _(t`Please try again.`)),
        );
        setProposePending(false);
        break;
    }
  }, [createProposalCandidateState, _]);

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalActionModal
        onDismiss={() => setShowTransactionFormModal(false)}
        show={showTransactionFormModal}
        onActionAdd={handleAddProposalAction}
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
        />
        {totalUSDCPayment > 0 && (
          <Alert variant="secondary" className={classes.tokenBuyerNotif}>
            <b>
              <Trans>Note</Trans>
            </b>
            :{' '}
            <Trans>
              Because this proposal contains a USDC fund transfer action we&apos;ve added an
              additional ETH transaction to refill the TokenBuyer contract. This action allows to
              DAO to continue to trustlessly acquire USDC to fund proposals like this.
            </Trans>
          </Alert>
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
