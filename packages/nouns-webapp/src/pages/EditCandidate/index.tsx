import { Col, Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalTransaction, useProposalThreshold } from '../../wrappers/nounsDao';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from '../CreateProposal/CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
import { processProposalDescriptionText } from '../../utils/processProposalDescriptionText';
import EditProposalButton from '../../components/EditProposalButton/index';
import ProposalTransactions from '../../components/ProposalTransactions';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import navBarButtonClasses from '../../components/NavBarButton/NavBarButton.module.css';
import ProposalActionModal from '../../components/ProposalActionsModal';
import config from '../../config';
import { useEthNeeded } from '../../utils/tokenBuyerContractUtils/tokenBuyer';
import {
  useUpdateProposalCandidate,
  useCandidateProposal,
  useGetUpdateCandidateCost,
} from '../../wrappers/nounsData';
import { ethers } from 'ethers';

interface EditCandidateProps {
  match: {
    params: { id: string };
  };
}

const EditCandidatePage: React.FC<EditCandidateProps> = props => {
  const [isProposalEdited, setIsProposalEdited] = useState(false);
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [isBodyEdited, setIsBodyEdited] = useState(false);
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [currentBlock, setCurrentBlock] = useState<number>();
  const { account } = useEthers();
  const { updateProposalCandidate, updateProposalCandidateState } = useUpdateProposalCandidate();
  const candidate = useCandidateProposal(props.match.params.id, 0, true, currentBlock); // get updatable transaction details
  const availableVotes = useUserVotes();
  const hasVotes = availableVotes && availableVotes > 0;
  const proposalThreshold = useProposalThreshold();
  const ethNeeded = useEthNeeded(
    config.addresses.tokenBuyer ?? '',
    totalUSDCPayment,
    config.addresses.tokenBuyer === undefined || totalUSDCPayment === 0,
  );
  const proposal = candidate.data?.version;
  const updateCandidateCost = useGetUpdateCandidateCost();
  const blockNumber = useBlockNumber();

  useEffect(() => {
    // prevent live-updating the block resulting in undefined block number
    if (blockNumber && !currentBlock) {
      setCurrentBlock(blockNumber);
    }
  }, [blockNumber, currentBlock]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proposalTransactions, totalUSDCPayment],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setIsProposalEdited(true);
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proposalTransactions, totalUSDCPayment],
  );

  const removeTitleFromDescription = (description: string, title: string) => {
    const titleRegex = new RegExp(`# ${title}\n\n`);
    return description.replace(titleRegex, '');
  };
  const isolatedDescription =
    candidate.data?.version.content.description &&
    removeTitleFromDescription(candidate.data.version.content.description, titleValue);

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
      if (title === candidate.data?.version.content.title) {
        setIsTitleEdited(false);
      } else {
        setIsTitleEdited(true);
      }
    },
    [setTitleValue, candidate.data?.version.content.title],
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
    [setBodyValue, isolatedDescription],
  );

  useEffect(() => {
    isTitleEdited || isBodyEdited ? setIsProposalEdited(true) : setIsProposalEdited(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProposalCandidateState, setModal]);

  // set initial values on page load
  useEffect(() => {
    if (proposal && candidate && !titleValue && !bodyValue && !proposalTransactions?.length) {
      const transactions = candidate.data?.version.content.details.map(
        (txn: { target: any; value: any; callData: any; functionSig: any }) => {
          return {
            address: txn.target,
            value: txn.value ?? '0',
            calldata: txn.callData,
            signature: txn.functionSig,
          };
        },
      );
      setTitleValue(proposal.content.title);
      setBodyValue(
        removeTitleFromDescription(proposal.content.description, proposal.content.title),
      );
      setProposalTransactions(transactions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, candidate]);

  if (candidate.data?.proposer.toLowerCase() !== account?.toLowerCase()) {
    return null;
  }

  const handleUpdateProposal = async () => {
    if (!proposalTransactions?.length) return;
    if (candidate === undefined) return;

    await updateProposalCandidate(
      proposalTransactions.map(({ address }) => address), // Targets
      proposalTransactions.map(({ value }) => value ?? '0'), // Values
      proposalTransactions.map(({ signature }) => signature ?? ''), // Signatures
      proposalTransactions.map(({ calldata }) => calldata), // Calldatas
      `# ${titleValue}\n\n${bodyValue}`, // Description
      candidate.data?.slug, // Slug
      candidate.data?.proposalIdToUpdate ? candidate.data?.proposalIdToUpdate : 0, // if candidate is an update to a proposal, use the proposalIdToUpdate number
      commitMessage,
      { value: hasVotes ? 0 : updateCandidateCost ?? 0 }, // Fee for non-nouners
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
          <Link to={`/candidates/${props.match.params.id}`}>
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
              Because this proposal contains a USDC fund transfer action we've added an additional
              ETH transaction to refill the TokenBuyer contract. This action allows to DAO to
              continue to trustlessly acquire USDC to fund proposals like this.
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
          isFormInvalid={isProposalEdited ? false : true}
          handleCreateProposal={handleUpdateProposal}
          isCandidate={true}
        />

        {!hasVotes && updateCandidateCost && +ethers.utils.formatEther(updateCandidateCost) > 0 && (
          <p className={classes.feeNotice}>
            {updateCandidateCost && ethers.utils.formatEther(updateCandidateCost)} ETH fee upon
            submission
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
