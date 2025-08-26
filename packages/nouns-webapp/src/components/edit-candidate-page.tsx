'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import dynamic from 'next/dynamic';
import { Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import { filter, isNullish } from 'remeda';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { useAccount, useBlockNumber } from 'wagmi';

// Dynamically import components that may reference browser APIs to avoid SSR evaluation
const EditProposalButton = dynamic(() => import('@/components/edit-proposal-button'), {
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

import { nounsTokenBuyerAddress } from '@/contracts';
import { cn } from '@/lib/utils';
import { processProposalDescriptionText } from '@/utils/process-proposal-description-text';
import { useEthNeeded } from '@/utils/token-buyer-contract-utils/token-buyer';
import { defaultChain } from '@/wagmi';
import { useUserVotes } from '@/wrappers/noun-token';
import { ProposalDetail, ProposalTransaction, useProposalThreshold } from '@/wrappers/nouns-dao';
import {
  useCandidateProposal,
  useGetUpdateCandidateCost,
  useUpdateProposalCandidate,
} from '@/wrappers/nouns-data';
import { Link, useParams } from 'react-router';


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
  const hasVotes = !isNullish(availableVotes) && availableVotes > 0;
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
        if (!isNullish(transaction.usdcValue)) {
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
  const { _ } = useLingui();

  useEffect(() => {
    switch (updateProposalCandidateState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        toast.success(_(t`Candidate updated!`));
        setProposePending(false);
        break;
      case 'Fail':
      case 'Exception':
        toast.error(updateProposalCandidateState?.errorMessage || _(t`Please try again.`));
        setProposePending(false);
        break;
    }
  }, [updateProposalCandidateState, _]);

  // set initial values on page load
  useEffect(() => {
    if (
      !isNullish(proposal) &&
      !isNullish(candidate) &&
      titleValue === '' &&
      bodyValue === '' &&
      (proposalTransactions?.length ?? 0) === 0
    ) {
      const transactions = candidate?.version.content.details.map((txn: ProposalDetail) => {
        return {
          address: txn.target,
          value: isNullish(txn.value) ? 0n : BigInt(txn.value.toString()),
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
          !isNullish(candidate?.proposalIdToUpdate) ? BigInt(candidate.proposalIdToUpdate) : 0n, // if a candidate is an update to a proposal, use the proposalIdToUpdate number
          commitMessage,
        ],
        value: hasVotes ? BigInt(0) : (updateCandidateCost ?? BigInt(0)),
      }, // Fee for non-nouners
    );
  };

  const updateFeeText = !isNullish(updateCandidateCost) ? formatEther(updateCandidateCost) : '0';

  return (
    <Section fullWidth={false} className="font-pt">
      <ProposalActionModal
        onDismiss={() => setShowTransactionFormModal(false)}
        show={showTransactionFormModal}
        onActionAdd={handleAddProposalAction}
      />
      <div className={cn('mx-auto w-full lg:w-2/3', 'rounded-[5px] bg-white px-10 py-0')}>
        <div className="flex items-center">
          <Link to={`/candidates/${id}`}>
            <button
              className={cn(
                'mr-4 mt-[0.1rem] inline-block h-8 w-8 appearance-none rounded-full p-0 font-bold',
                'border border-black/10 bg-white text-[rgb(95,95,95)] hover:bg-[#e2e3e8] hover:text-black',
              )}
            >
              ←
            </button>
          </Link>
          <h3 className="my-4 font-londrina text-[42px]">
            <Trans>Edit Proposal Candidate</Trans>
          </h3>
        </div>
        <Alert variant="secondary" className="rounded-[8px]">
          <b>
            <Trans>Note</Trans>
          </b>
          : <Trans>Editing a proposal will clear all previous feedback</Trans>
        </Alert>
        <div className="d-grid">
          <Button
            className="h-[50px] rounded-[8px] font-pt text-[24px] font-bold transition-all duration-150 ease-in-out hover:cursor-pointer hover:opacity-50"
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
          <Alert variant="secondary" className="mt-4 rounded-[8px]">
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
        <InputGroup className="[&_input]:mt-4 [&_input]:w-full [&_input]:rounded-[8px] [&_input]:border [&_input]:border-[#aaa] [&_input]:text-base [&_input]:text-[#212529]">
          <FormControl
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
            placeholder="Optional commit message"
          />
        </InputGroup>

        <EditProposalButton
          className="h-[50px] rounded-[8px] font-pt text-[18px] font-bold transition-all duration-150 ease-in-out hover:cursor-pointer hover:opacity-50"
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold ?? undefined}
          hasActiveOrPendingProposal={false} // not relevant for edit
          hasEnoughVote={true}
          isFormInvalid={!isProposalEdited}
          handleCreateProposal={handleUpdateProposal}
          isCandidate={true}
        />

        {!hasVotes &&
          !isNullish(updateCandidateCost) &&
          Number(formatEther(updateCandidateCost)) > 0 && (
            <p className="text-center text-[18px] text-[#6c757d]">{updateFeeText} ETH fee upon submission</p>
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
      </div>
    </Section>
  );
};

export default dynamic(() => Promise.resolve(EditCandidatePage), { ssr: false });
