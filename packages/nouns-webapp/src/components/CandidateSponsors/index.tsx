import { Trans } from '@lingui/macro';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { useCallback, useEffect, useState } from 'react';
import config, { CHAIN_ID } from '../../config';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useProposeBySigs } from '../../wrappers/nounsData';
import { useProposalThreshold } from '../../wrappers/nounsDao';
import { ProposalCandidate, useCandidateProposal } from '../../wrappers/nounsData';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import React from 'react';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './CandidateSponsors.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Signature from './Signature';
import SignatureForm from './SignatureForm';
import { useQuery } from '@apollo/client';

interface CandidateSponsorsProps {
  candidate: ProposalCandidate;
  slug: string;
  signatures?: {
    reason: string;
    expirationTimestamp: number;
    sig: string;
    canceled: boolean;
    signer: {
      id: string;
      proposals: {
        id: string;
      }[];
    };
  }[];
  isProposer: boolean;
  id: string;
}

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const [requiredVotes, setRequiredVotes] = React.useState<number>();
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const [isAccountSigner, setIsAccountSigner] = React.useState<boolean>(false);
  const [isVoteCountUpdated, setIsVoteCountUpdated] = React.useState<boolean>(false);
  const blockNumber = useBlockNumber();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const threshold = useProposalThreshold();
  const signers = props.candidate.version.versionSignatures?.map(signature => signature.signer.id);
  const candidateProposal = useCandidateProposal(props.id);
  const { account } = useEthers();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signers, blockNumber ?? 0),
  );

  const handleSignerCountDecrease = (decreaseAmount: number) => {
    setSignedVotes(updatedSignerCount => updatedSignerCount - decreaseAmount);
    setIsVoteCountUpdated(true);
  };

  useEffect(() => {
    if (threshold !== undefined) {
      setRequiredVotes(threshold + 1);
    }
  }, [threshold]);

  useEffect(() => {
    // only set the vote count if the count hasn't been updated by remove/add signature
    // this prevents the count from being reset to the stale value
    if (!isVoteCountUpdated) {
      if (props.signatures && signedVotes === 0) {
        props.signatures.map((signature, i) => {
          if (signature.expirationTimestamp < Math.round(Date.now() / 1000)) {
            props.signatures?.splice(i, 1);
          }
          if (signature.signer.id.toUpperCase() === account?.toUpperCase()) {
            setIsAccountSigner(true);
          }
          delegateSnapshot?.delegates?.map(delegate => {
            if (delegate.id === signature.signer.id) {
              setSignedVotes(signedVotes => signedVotes + delegate.nounsRepresented.length);
            }
          });
        });
      }
    }
  }, [props.signatures, delegateSnapshot]);

  const [isProposePending, setProposePending] = useState(false);
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const [addSignatureTransactionState, setAddSignatureTransactionState] = useState<
    'None' | 'Success' | 'Mining' | 'Fail' | 'Exception'
  >('None');

  useEffect(() => {
    switch (proposeBySigsState.status) {
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
          message: proposeBySigsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: proposeBySigsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [proposeBySigsState, setModal]);

  const submitProposalOnChain = async () => {
    await proposeBySigs(
      props.signatures?.map((s: any) => [s.sig, s.signer.id, s.expirationTimestamp]),
      candidateProposal?.version.targets,
      candidateProposal?.version.values,
      candidateProposal?.version.signatures,
      candidateProposal?.version.calldatas,
      candidateProposal?.version.description,
    );
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.interiorWrapper}>
        {requiredVotes && signedVotes >= requiredVotes && (
          <p className={classes.thresholdMet}>
            <FontAwesomeIcon icon={faCircleCheck} /> Sponsor threshold met
          </p>
        )}
        <h4 className={classes.header}>
          <strong>
            {signedVotes >= 0 ? signedVotes : '...'} of {requiredVotes || '...'} Sponsored Votes
          </strong>
        </h4>
        <p className={classes.subhead}>
          {requiredVotes && signedVotes >= requiredVotes ? (
            <Trans>
              This candidate has met the required threshold, but Nouns voters can still add support
              until it’s put on-chain.
            </Trans>
          ) : (
            <>Proposal candidates must meet the required Nouns vote threshold.</>
          )}
        </p>
        <ul className={classes.sponsorsList}>
          {props.signatures &&
            props.signatures.map(signature => {
              if (signature.canceled) return null;
              return (
                <Signature
                  key={signature.signer.id}
                  reason={signature.reason}
                  expirationTimestamp={signature.expirationTimestamp}
                  signer={signature.signer.id}
                  isAccountSigner={isAccountSigner}
                  sig={signature.sig}
                  handleSignerCountDecrease={handleSignerCountDecrease}
                />
              );
            })}
          {props.signatures &&
            requiredVotes &&
            signedVotes < requiredVotes &&
            Array(requiredVotes - props.signatures.length)
              .fill('')
              .map((_s, i) => <li className={classes.placeholder}> </li>)}

          {props.isProposer && requiredVotes && signedVotes >= requiredVotes ? (
            <button className={classes.button} onClick={() => submitProposalOnChain()}>
              Submit on-chain
            </button>
          ) : (
            <>
              {!isAccountSigner && (
                <>
                  {connectedAccountNounVotes > 0 ? (
                    <button
                      className={classes.button}
                      onClick={() => setIsFormDisplayed(!isFormDisplayed)}
                    >
                      Sponsor
                    </button>
                  ) : (
                    <div className={classes.withoutVotesMsg}>
                      <p>
                        <Trans>Sponsoring a proposal requires at least one Noun vote</Trans>
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </ul>
        <AnimatePresence>
          {addSignatureTransactionState === 'Success' && (
            <div className="transactionStatus success">
              <p>Success!</p>
            </div>
          )}
          {isFormDisplayed ? (
            <motion.div
              className={classes.formOverlay}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              <button className={classes.closeButton} onClick={() => setIsFormDisplayed(false)}>
                &times;
              </button>
              <SignatureForm
                id={props.id}
                transactionState={addSignatureTransactionState}
                setTransactionState={setAddSignatureTransactionState}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className={classes.aboutText}>
        <p>
          <strong>About sponsoring proposal candidates</strong>
        </p>
        <p>
          Once a signed proposal is on-chain, signers will need to wait until the proposal is queued
          or defeated before putting another proposal on-chain.
        </p>
      </div>
    </div>
  );
};

export default CandidateSponsors;
