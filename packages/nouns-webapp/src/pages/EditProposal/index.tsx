import { Col, Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalTransaction,
  ProposalDetail,
  useProposal,
  useProposalThreshold,
  useUpdateProposal,
  useUpdateProposalDescription,
  useUpdateProposalTransactions,
} from '../../wrappers/nounsDao';
import classes from '../CreateProposal/CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
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
import { useUserVotes } from '../../wrappers/nounToken';
import { useCreateProposalCandidate, useGetCreateCandidateCost } from '../../wrappers/nounsData';

interface EditProposalProps {
  match: {
    params: { id: string };
  };
}

const EditProposalPage: React.FC<EditProposalProps> = props => {
  const [isProposalEdited, setIsProposalEdited] = useState(false);
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [isBodyEdited, setIsBodyEdited] = useState(false);
  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);
  const [originalTitleValue, setOriginalTitleValue] = useState('');
  const [originalBodyValue, setOriginalBodyValue] = useState('');
  const [slug, setSlug] = useState('');
  const [originalProposalTransactions, setOriginalProposalTransactions] = useState<
    ProposalDetail[]
  >([]);
  const proposal = useProposal(props.match.params.id, true);
  const proposalThreshold = useProposalThreshold();
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const { account } = useEthers();
  const { updateProposal, updateProposalState } = useUpdateProposal();
  const { updateProposalDescription, updateProposalDescriptionState } =
    useUpdateProposalDescription();
  const { updateProposalTransactions, updateProposaTransactionsState } =
    useUpdateProposalTransactions();
  const { createProposalCandidate, createProposalCandidateState } = useCreateProposalCandidate();
  const availableVotes = useUserVotes();
  const createCandidateCost = useGetCreateCandidateCost();
  const hasEnoughVote = Boolean(
    availableVotes && proposalThreshold !== undefined && availableVotes > proposalThreshold,
  );
  const ethNeeded = useEthNeeded(
    config.addresses.tokenBuyer ?? '',
    totalUSDCPayment,
    config.addresses.tokenBuyer === undefined || totalUSDCPayment === 0,
  );

  const removeTitleFromDescription = (description: string, title: string) => {
    const titleRegex = new RegExp(`# ${title}\n\n`);
    return description.replace(titleRegex, '');
  };
  const isolatedDescription =
    proposal?.description && removeTitleFromDescription(proposal?.description, titleValue);
  const isProposedBySigners = proposal?.signers && proposal?.signers?.length > 0 ? true : false;

  const candidateUpdateSlug = (slug: string) => {
    // add random string to slug to make it unique
    const randomString = Math.random().toString(36).substring(7);
    return `${slug}-update-${randomString}`;
  }

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
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
      setIsProposalEdited(true);
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
      if (isProposedBySigners && title === proposal?.title) {
        // if title is edited, then reset to original, make sure the unique update slug gets passed
        setSlug(candidateUpdateSlug(title));
      } else {
        setSlug(
          title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, ''),
        );
      }
      if (title === proposal?.title) {
        setIsTitleEdited(false);
      } else {
        setIsTitleEdited(true);
      }
    },
    [setTitleValue, setSlug, proposal?.title, isProposedBySigners],
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

  useEffect(() => {
    switch (updateProposalDescriptionState.status) {
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
          message: updateProposalDescriptionState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: updateProposalDescriptionState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [updateProposalDescriptionState, setModal, updateProposalDescriptionState?.errorMessage]);

  useEffect(() => {
    switch (updateProposaTransactionsState.status) {
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
          message: updateProposaTransactionsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: updateProposaTransactionsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [updateProposaTransactionsState, setModal, updateProposaTransactionsState?.errorMessage]);

  const isProposer = () => {
    if (proposal?.proposer?.toLowerCase() === account?.toLowerCase()) {
      return true;
    }
    return false;
  };

  const isTransactionsEdited = () => {
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
    return false;
  };

  const isDescriptionEdited = () => {
    return originalTitleValue !== titleValue || originalBodyValue !== bodyValue ? true : false;
  };

  const handleUpdateProposal = async () => {
    if (!proposalTransactions?.length) return;
    if (proposal === undefined) return;

    // check to see if only description or only transactions are edited
    if (isDescriptionEdited() && !isTransactionsEdited()) {
      // only update description
      await updateProposalDescription(
        proposal.id,
        `# ${titleValue}\n\n${bodyValue}`,
        commitMessage,
      );
    }
    if (!isDescriptionEdited() && isTransactionsEdited()) {
      // only update transactions
      await updateProposalTransactions(
        proposal.id,
        proposalTransactions.map(({ address }) => address), // Targets
        proposalTransactions.map(({ value }) => value ?? '0'), // Values
        proposalTransactions.map(({ signature }) => signature ?? ''), // Signatures
        proposalTransactions.map(({ calldata }) => calldata), // Calldatas
        commitMessage,
      );
    }
    if (isDescriptionEdited() && isTransactionsEdited()) {
      // update all
      await updateProposal(
        proposal.id, // proposalId
        proposalTransactions.map(({ address }) => address), // Targets
        proposalTransactions.map(({ value }) => value ?? '0'), // Values
        proposalTransactions.map(({ signature }) => signature ?? ''), // Signatures
        proposalTransactions.map(({ calldata }) => calldata), // Calldatas
        `# ${titleValue}\n\n${bodyValue}`, // Description
        commitMessage,
      );
    }
  };



  // set initial values on page load
  useEffect(() => {
    if (
      proposal &&
      !titleValue &&
      !bodyValue &&
      !proposalTransactions.length &&
      !originalTitleValue &&
      !originalBodyValue &&
      !originalProposalTransactions.length
    ) {
      const transactions = proposal.details.map(txn => {
        return {
          address: txn.target,
          value: txn.value ?? '0',
          calldata: txn.callData,
          signature: txn.functionSig ?? '',
        };
      });
      const slugValue = proposal.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setTitleValue(proposal.title);
      if (isProposedBySigners) {
        // new candidate will need to be created, which needs a unique slug, so add a random string to the slug here
        setSlug(candidateUpdateSlug(slugValue));
      } else {
        setSlug(slugValue);
      }
      setBodyValue(removeTitleFromDescription(proposal.description, proposal.title));
      setProposalTransactions(transactions);
      setOriginalTitleValue(proposal.title);
      setOriginalBodyValue(removeTitleFromDescription(proposal.description, proposal.title));
      setOriginalProposalTransactions(proposal.details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  const handleCreateNewCandidate = async () => {
    if (!proposalTransactions?.length ||
      !titleValue ||
      !bodyValue ||
      !slug ||
      !props.match.params.id
    ) return;
    await createProposalCandidate(
      proposalTransactions.map(({ address }) => address), // Targets
      proposalTransactions.map(({ value }) => value ?? '0'), // Values
      proposalTransactions.map(({ signature }) => signature), // Signatures
      proposalTransactions.map(({ calldata }) => calldata), // Calldatas
      `# ${titleValue}\n\n${bodyValue}`, // Description
      slug, // Slug
      props.match.params.id, // use 0 for new proposals
      { value: availableVotes! > 0 ? 0 : createCandidateCost },
    );
  };

  // used if updating a proposal that was created by signers
  useEffect(() => {
    switch (createProposalCandidateState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: (
            <Trans>
              Proposal Candidate Created!
              <br />
              <Link to={`/candidates/${slug}`}>View the candidate</Link>
            </Trans>
          ),
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: createProposalCandidateState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: createProposalCandidateState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProposalCandidateState, setModal]);

  const isFormInvalid = () => {
    if (
      !(isProposalEdited || isTransactionsEdited() || isDescriptionEdited()) ||
      !proposalTransactions.length ||
      titleValue === '' ||
      bodyValue === '' ||
      slug === ''
    ) {
      return true;
    }
    return false;
  }
  if (!isProposer()) {
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
          <Link to={`/vote/${props.match.params.id}`}>
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
          :{' '}
          {isProposedBySigners ? (
            <Trans>
              This proposal was created by candidate signatures. Editing the proposal will create a
              new proposal candidate requiring the original signers to resign to update the onchain
              proposal.
            </Trans>
          ) : (
            <Trans>Editing a proposal will clear all previous feedback</Trans>
          )}
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
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        {!isProposedBySigners && (
          <InputGroup className={classes.commitMessage}>
            <FormControl
              value={commitMessage}
              onChange={e => setCommitMessage(e.target.value)}
              placeholder="Optional commit message"
            />
          </InputGroup>
        )}

        <EditProposalButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold}
          hasActiveOrPendingProposal={false} // not relevant for edit
          hasEnoughVote={isProposer() ? true : hasEnoughVote}
          isFormInvalid={
            isFormInvalid()
          }
          handleCreateProposal={
            isProposedBySigners ? handleCreateNewCandidate : handleUpdateProposal
          }
        />
      </Col>
    </Section>
  );
};

export default EditProposalPage;
