import React, { useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Alert, Button, Col, FormControl, InputGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router';
import { formatEther } from 'viem';
import { useAccount, useBlockNumber } from 'wagmi';

import EditProposalButton from '@/components/EditProposalButton/index';
import ProposalActionModal from '@/components/ProposalActionsModal';
import ProposalEditor from '@/components/ProposalEditor';
import ProposalTransactions from '@/components/ProposalTransactions';
import { nounsTokenBuyerAddress } from '@/contracts';
import { useAppDispatch } from '@/hooks';
import Section from '@/layout/Section';
import { AlertModal, setAlertModal } from '@/state/slices/application';
import { processProposalDescriptionText } from '@/utils/processProposalDescriptionText';
import { useEthNeeded } from '@/utils/tokenBuyerContractUtils/tokenBuyer';
import { defaultChain } from '@/wagmi';
import { ProposalDetail, ProposalTransaction, useProposalThreshold } from '@/wrappers/nounsDao';
import {
  useCandidateProposal,
  useGetUpdateCandidateCost,
  useUpdateProposalCandidate,
} from '@/wrappers/nounsData';
import { useUserVotes } from '@/wrappers/nounToken';

import classes from '../CreateProposal/CreateProposal.module.css';

import navBarButtonClasses from '@/components/NavBarButton/NavBarButton.module.css';

interface EditCandidateProps {
  match: {
    params: { id: string };
  };
}

const EditCandidatePage: React.FC<EditCandidateProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [isProposalEdited, setIsProposalEdited] = useState(false);
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [isBodyEdited, setIsBodyEdited] = useState(false);
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [commitMessage, setCommitMessage] = useState<string>('');
  const { address: account } = useAccount();
  const { updateProposalCandidate, updateProposalCandidateState } = useUpdateProposalCandidate();
  const { data: currentBlock } = useBlockNumber({ watch: true });
  const { data: candidate } = useCandidateProposal(id ?? '', 0, true, currentBlock); // get updatable transaction details
  const availableVotes = useUserVotes();
  const hasVotes = availableVotes && availableVotes > 0;
  const proposalThreshold = useProposalThreshold();
  const chainId = defaultChain.id;
  const ethNeeded = useEthNeeded(
    nounsTokenBuyerAddress[chainId],
    totalUSDCPayment,
    nounsTokenBuyerAddress[chainId] == undefined || totalUSDCPayment === 0,
  );
  const proposal = candidate?.version;
  const updateCandidateCost = useGetUpdateCandidateCost();

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
      setIsProposalEdited(true);
    },

    [proposalTransactions, totalUSDCPayment],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setIsProposalEdited(true);
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },

    [proposalTransactions, totalUSDCPayment],
  );

  const removeTitleFromDescription = (description: string, title: string) => {
    const titleRegex = new RegExp(`# ${title}\n\n`);
    return description.replace(titleRegex, '');
  };
  const isolatedDescription =
    candidate?.version.content.description &&
    removeTitleFromDescription(candidate.version.content.description, titleValue);

  useEffect(() => {
    if (ethNeeded !== undefined && ethNeeded !== tokenBuyerTopUpEth && totalUSDCPayment > 0) {
      const hasTokenBuyterTopTop =
        proposalTransactions.filter(txn => txn.address === nounsTokenBuyerAddress[chainId]).length >
        0;
      // Add a new top up txn if one isn't there already, else add to the existing one
      if (Number(ethNeeded) > 0 && !hasTokenBuyterTopTop) {
        handleAddProposalAction({
          address: nounsTokenBuyerAddress[chainId],
          value: BigInt(ethNeeded ?? 0),
          calldata: '0x',
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
      if (title === candidate?.version.content.title) {
        setIsTitleEdited(false);
      } else {
        setIsTitleEdited(true);
      }
    },
    [setTitleValue, candidate?.version.content.title],
  );

  const handleBodyInput = useCallback(
    (body: string) => {
      setBodyValue(body);
      if (body === isolatedDescription) {
        setIsBodyEdited(false);
      } else {
        setIsBodyEdited(true);
      }
    },
    [setBodyValue],
  );

  useEffect(() => {
    if (isTitleEdited || isBodyEdited) {
      setIsProposalEdited(true);
    } else {
      setIsProposalEdited(false);
    }
  }, [isTitleEdited, isBodyEdited]);

  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  useEffect(() => {
    switch (updateProposalCandidateState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Candidate updated!</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: updateProposalCandidateState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: updateProposalCandidateState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [updateProposalCandidateState, setModal]);

  // set initial values on page load
  useEffect(() => {
    if (proposal && candidate && !titleValue && !bodyValue && !proposalTransactions?.length) {
      const transactions = candidate?.version.content.details.map((txn: ProposalDetail) => {
        return {
          address: txn.target,
          value: txn.value ? BigInt(txn.value.toString()) : BigInt(0),
          calldata: txn.callData,
          signature: txn.functionSig,
        };
      });
      setTitleValue(proposal.content.title);
      setBodyValue(
        removeTitleFromDescription(proposal.content.description, proposal.content.title),
      );
      setProposalTransactions(
        transactions.map(txn => ({
          ...txn,
          value: txn.value,
          signature: txn.signature || '',
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, candidate]);

  if (candidate?.proposer.toLowerCase() !== account?.toLowerCase()) {
    return null;
  }

  const handleUpdateProposal = async () => {
    if (!proposalTransactions?.length) return;
    if (candidate == undefined) return;

    await updateProposalCandidate(
      {
        args: [
          proposalTransactions.map(({ address }) => address as `0x${string}`), // Targets
          proposalTransactions.map(({ value }) => BigInt(value ?? '0')), // Values
          proposalTransactions.map(({ signature }) => signature), // Signatures
          proposalTransactions.map(({ calldata }) => calldata as `0x${string}`), // Calldatas
          `# ${titleValue}\n\n${bodyValue}`, // Description
          candidate?.slug, // Slug
          candidate?.proposalIdToUpdate ? BigInt(candidate.proposalIdToUpdate) : 0n, // if a candidate is an update to a proposal, use the proposalIdToUpdate number
          commitMessage,
        ],
        value: hasVotes ? BigInt(0) : (updateCandidateCost ?? BigInt(0)),
      }, // Fee for non-nouners
    );
  };

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalActionModal
        onDismiss={() => setShowTransactionFormModal(false)}
        show={showTransactionFormModal}
        onActionAdd={handleAddProposalAction}
      />
      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <div className={classes.wrapper}>
          <Link to={`/candidates/${id}`}>
            <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
          </Link>
          <h3 className={classes.heading}>
            <Trans>Edit Proposal Candidate</Trans>
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
          isProposalUpdate={true}
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
          body={processProposalDescriptionText(bodyValue, titleValue)}
          // handleContentChange={handleContentChange}
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
          isFormInvalid={!isProposalEdited}
          handleCreateProposal={handleUpdateProposal}
          isCandidate={true}
        />

        {!hasVotes && !!updateCandidateCost && Number(formatEther(updateCandidateCost)) > 0 && (
          <p className={classes.feeNotice}>
            {updateCandidateCost ? formatEther(updateCandidateCost) : '0'} ETH fee upon submission
          </p>
        )}

        <p className="text-center">
          <Trans>This will clear all previous sponsors and feedback votes</Trans>
          {proposal && proposal.content.contentSignatures?.length > 0 && (
            <>
              <br />
              <Trans>
                This candidate currently has {proposal.content.contentSignatures?.length}{' '}
                signatures.
              </Trans>
            </>
          )}
        </p>
      </Col>
    </Section>
  );
};

export default EditCandidatePage;
