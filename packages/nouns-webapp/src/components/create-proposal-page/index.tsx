'use client';

import type { Hex } from '@/utils/types';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import { filter } from 'remeda';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

// Dynamically import components to avoid SSR evaluation issues
const CreateProposalButton = dynamic(() => import('@/components/create-proposal-button'), {
  ssr: false,
});
const ProposalActionModal = dynamic(() => import('@/components/proposal-actions-modal'), {
  ssr: false,
});
const ProposalEditor = dynamic(() => import('@/components/proposal-editor'), { ssr: false });
const ProposalTransactions = dynamic(() => import('@/components/proposal-transactions'), {
  ssr: false,
});
const Section = dynamic(() => import('@/components/section'), { ssr: false });

import config from '@/config';
import { nounsLegacyTreasuryAddress, nounsTokenBuyerAddress } from '@/contracts';
import { buildEtherscanHoldingsLink } from '@/utils/etherscan';
import { useEthNeeded } from '@/utils/token-buyer-contract-utils/token-buyer';
import { defaultChain } from '@/wagmi';
import {
  ProposalState,
  ProposalTransaction,
  useIsDaoGteV3,
  useProposal,
  useProposalCount,
  useProposalThreshold,
  usePropose,
  useProposeOnTimelockV1,
} from '@/wrappers/nounsDao';
import { useUserVotes } from '@/wrappers/nounToken';
import { Link } from 'react-router';

import classes from './create-proposal.module.css';

import navBarButtonClasses from '@/components/nav-bar-button/nav-bar-button.module.css';

const CreateProposalPage = () => {
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);
  const [isProposeOnV1, setIsProposeOnV1] = useState(false);
  const [isV1OptionVisible, setIsV1OptionVisible] = useState(false);
  const [previousProposalId, setPreviousProposalId] = useState<number | undefined>(undefined);
  const latestProposalId = useProposalCount();
  const latestProposal = useProposal(latestProposalId ?? 0);
  const availableVotes = useUserVotes();
  const proposalThreshold = useProposalThreshold();
  const { address: account } = useAccount();
  const { propose, proposeState } = usePropose();
  const { proposeOnTimelockV1, proposeOnTimelockV1State } = useProposeOnTimelockV1();
  const { _ } = useLingui();
  const chainId = defaultChain.id;
  const ethNeeded = useEthNeeded(
    nounsTokenBuyerAddress[chainId] ?? '',
    totalUSDCPayment,
    nounsTokenBuyerAddress[chainId] == undefined || totalUSDCPayment === 0,
  );
  const isDaoGteV3 = useIsDaoGteV3();
  const daoEtherscanLink = buildEtherscanHoldingsLink(
    nounsLegacyTreasuryAddress[chainId], // This should always point at the V1 executor
  );

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
    // only set this once
    if (latestProposalId !== undefined && !previousProposalId) {
      setPreviousProposalId(latestProposalId);
    }
  }, [latestProposalId, previousProposalId]);

  useEffect(() => {
    if (ethNeeded !== undefined && ethNeeded !== tokenBuyerTopUpEth && totalUSDCPayment > 0) {
      const hasTokenBuyerTopUp =
        filter(
          proposalTransactions,
          txn => txn.address.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase(),
        ).length > 0;

      // Add a new top up txn if one isn't there already, else add to the existing one
      if (Number(ethNeeded) > 0 && !hasTokenBuyerTopUp) {
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

          const txns = proposalTransactions;
          if (indexOfTokenBuyerTopUp.length > 0) {
            txns[indexOfTokenBuyerTopUp[0]].value = BigInt(ethNeeded);
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
    if (isProposeOnV1) {
      await proposeOnTimelockV1({
        args: [
          proposalTransactions.map(({ address }) => address), // Targets
          proposalTransactions.map(({ value }) => value ?? '0'), // Values
          proposalTransactions.map(({ signature }) => signature), // Signatures
          proposalTransactions.map(({ calldata }) => calldata), // Calldatas
          `# ${titleValue}\n\n${bodyValue}`, // Description
        ],
      });
    } else {
      await propose({
        args: [
          proposalTransactions.map(({ address }) => address), // Targets
          proposalTransactions.map(({ value }) => value ?? '0'), // Values
          proposalTransactions.map(({ signature }) => signature), // Signatures
          proposalTransactions.map(({ calldata }) => calldata), // Calldatas
          `# ${titleValue}\n\n${bodyValue}`, // Description
          0,
        ],
      });
    }
  };

  const handleAddProposalState = useCallback(
    ({ errorMessage, status }: { status: string; errorMessage?: string }) => {
      switch (status) {
        case 'None':
          setProposePending(false);
          break;
        case 'Mining':
          setProposePending(true);
          break;
        case 'Success':
          toast.success(_(t`Proposal Created!`));
          setProposePending(false);
          break;
        case 'Fail':
        case 'Exception':
          toast.error(errorMessage || _(t`Please try again.`));
          setProposePending(false);
          break;
      }
    },
    [_],
  );

  useEffect(() => {
    if (isProposeOnV1) {
      handleAddProposalState(proposeOnTimelockV1State);
    } else {
      handleAddProposalState(proposeState);
    }
  }, [
    propose,
    proposeState,
    proposeOnTimelockV1,
    proposeOnTimelockV1State,
    isProposeOnV1,
    handleAddProposalState,
  ]);

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
            <Trans>Create Proposal</Trans>
          </h3>
        </div>
        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <b>
            <Trans>Tip</Trans>
          </b>
          :{' '}
          <Trans>
            Add one or more proposal actions and describe your proposal for the community. The
            proposal cannot be modified after submission, so please verify all information before
            submitting. The voting period will begin after 5 days and last for 5 days.
          </Trans>
          <br />
          <br />
          <Trans>
            You <b>MUST</b> maintain enough voting power to meet the proposal threshold until your
            proposal is executed. If you fail to do so, anyone can cancel your proposal.
          </Trans>
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

        {totalUSDCPayment > 0 && tokenBuyerTopUpEth !== '0' && (
          <Alert variant="secondary" className={classes.tokenBuyerNotif}>
            <b>
              <Trans>Note</Trans>
            </b>
            :{' '}
            <Trans>
              Because this proposal contains a USDC fund transfer action we&apos;ve added an
              additional additional ETH transaction to refill the TokenBuyer contract. This action
              allows to continue to trustlessly acquire USDC to fund proposals like this.
            </Trans>
          </Alert>
        )}
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        <p className="m-0 p-0">Looking for treasury v1?</p>
        <p className={classes.note}>
          If you&apos;re not sure what this means, you probably don&apos;t need it. Otherwise, you
          can interact with the original treasury{' '}
          <button
            type="button"
            className={classes.inlineButton}
            onClick={() => setIsV1OptionVisible(!isV1OptionVisible)}
          >
            here
          </button>
          .
        </p>

        {isDaoGteV3 && config.featureToggles.proposeOnV1 && isV1OptionVisible && (
          <div className={classes.timelockOption}>
            <div className={classes.timelockSelect}>
              <Form.Check
                type="checkbox"
                id={`timelockV1Checkbox`}
                label="Propose on treasury V1"
                onChange={() => setIsProposeOnV1(!isProposeOnV1)}
              />
            </div>
            <p className={classes.note}>
              Used to interact with any assets owned by the{' '}
              <a href={daoEtherscanLink} target="_blank" rel="noreferrer">
                original treasury
              </a>
              . Most proposers can ignore this.
            </p>
          </div>
        )}
        <CreateProposalButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold ?? undefined}
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

export default dynamic(
  async () => {
    const mod = await import('react-stepz');
    return mod.withStepProgress(CreateProposalPage);
  },
  { ssr: false },
);
