import React, { useEffect, useState } from 'react';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { useAccount } from 'wagmi';

import { Proposal, ProposalState, useActivePendingUpdatableProposers } from '@/wrappers/nounsDao';
import { ProposalCandidate } from '@/wrappers/nounsData';
import { useDelegateNounsAtBlockQuery, useUserVotes } from '@/wrappers/nounToken';

import classes from './CandidateSponsors.module.css';
import OriginalSignature from './OriginalSignature';
import SelectSponsorsToPropose from './SelectSponsorsToPropose';
import Signature from './Signature';
import SignatureForm from './SignatureForm';
import SubmitUpdateProposal from './SubmitUpdateProposal';

interface CandidateSponsorsProps {
  candidate: ProposalCandidate;
  slug: string;
  isProposer: boolean;
  id: string;
  handleRefetchCandidateData: () => void;
  setDataFetchPollInterval: (interval: number | null) => void;
  currentBlock: bigint;
  requiredVotes: number;
  userVotes: number;
  isSignerWithActiveOrPendingProposal?: boolean;
  latestProposal?: Proposal;
  isUpdateToProposal?: boolean;
  originalProposal?: Proposal;
  blockNumber?: bigint;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const [isAccountSigner, setIsAccountSigner] = React.useState<boolean>(false);
  const [isOriginalSigner, setIsOriginalSigner] = useState<boolean>(false);
  const [isThresholdMet, setIsThresholdMet] = React.useState<boolean>(false);
  const { address: account } = useAccount();
  const activePendingProposers = useActivePendingUpdatableProposers(props.blockNumber);
  const connectedAccountNounVotes = useUserVotes() || 0;
  const originalSigners = props.originalProposal?.signers.map(signer => signer.id.toLowerCase());
  const originalSignersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    originalSigners ?? [],
    BigInt(props.blockNumber ?? 0),
  );
  const signatures = props.candidate.version.content.contentSignatures;
  const signers = signatures?.map(signature => signature.signer.id.toLowerCase());
  const isParentProposalUpdatable = props.originalProposal?.status === ProposalState.UPDATABLE;

  useEffect(() => {
    // set relevant vars from fetched candidate data
    (() => {
      if (
        props.candidate.proposerVotes + props.candidate.voteCount >=
        props.candidate.requiredVotes
      ) {
        setIsThresholdMet(true);
      } else {
        setIsThresholdMet(false);
      }
      if (props.originalProposal?.signers) {
        setIsThresholdMet(signatures.length >= props.originalProposal?.signers?.length);
      }
    })();
  }, [props.candidate, props.originalProposal?.signers, signatures]);

  useEffect(() => {
    (() => {
      if (props.originalProposal && props.originalProposal.signers && account) {
        if (originalSigners && originalSigners.includes(account.toLowerCase())) {
          setIsOriginalSigner(true);
        } else {
          setIsOriginalSigner(false);
        }
      }
    })();
  }, [props.originalProposal, account, originalSigners]);

  useEffect(() => {
    if (signatures && account) {
      const isAccountSigner = signatures.find(
        signature => signature.signer.id.toLowerCase() === account?.toLowerCase(),
      );
      if (isAccountSigner) {
        setIsAccountSigner(true);
      } else {
        setIsAccountSigner(false);
      }
    }
  }, [signatures, account]);

  const [addSignatureTransactionState, setAddSignatureTransactionState] = useState<
    'None' | 'Success' | 'Mining' | 'Fail' | 'Exception'
  >('None');

  const refetchData = () => {
    props.handleRefetchCandidateData();
  };

  const handleSignatureRemoved = () => {
    refetchData();
  };
  return (
    <>
      <SelectSponsorsToPropose
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        signatures={props.candidate.version.content.contentSignatures}
        requiredVotes={props.candidate.requiredVotes}
        candidate={props.candidate}
        blockNumber={props.blockNumber}
        setDataFetchPollInterval={props.setDataFetchPollInterval}
        handleRefetchCandidateData={props.handleRefetchCandidateData}
      />
      {props.isUpdateToProposal && (
        <SubmitUpdateProposal
          isModalOpen={isUpdateModalOpen}
          setIsModalOpen={setIsUpdateModalOpen}
          signatures={props.candidate.version.content.contentSignatures}
          candidate={props.candidate}
          setDataFetchPollInterval={props.setDataFetchPollInterval}
          handleRefetchCandidateData={props.handleRefetchCandidateData}
          proposalIdToUpdate={props.originalProposal?.id ? props.originalProposal?.id : ''}
        />
      )}
      <div className={classes.wrapper}>
        {isThresholdMet && (
          <p className={classes.thresholdMet}>
            <FontAwesomeIcon icon={faCircleCheck} /> Sponsor threshold met
          </p>
        )}
        <div
          className={clsx(classes.interiorWrapper, isFormDisplayed && classes.formOverlayVisible)}
        >
          {signatures ? (
            <>
              {!isFormDisplayed ? (
                <>
                  <h4 className={classes.header}>
                    <strong>
                      {props.isUpdateToProposal ? (
                        <>
                          {props.candidate.voteCount >= 0 ? props.candidate.voteCount : '...'} of{' '}
                          {props.originalProposal?.signers.length || '...'} original signed votes
                        </>
                      ) : (
                        <>
                          {props.candidate.voteCount === 0 &&
                          props.candidate.proposerVotes > props.candidate.requiredVotes ? (
                            <>
                              <Trans>No sponsored votes needed</Trans>
                            </>
                          ) : (
                            <>
                              {props.candidate.voteCount >= 0 ? props.candidate.voteCount : '...'}{' '}
                              of{' '}
                              {(() => {
                                if (props.candidate.proposerVotes > props.candidate.requiredVotes) {
                                  return <em className={classes.naVotesLabel}>n/a</em>;
                                } else if (props.candidate.requiredVotes != undefined) {
                                  return <>{props.candidate.requiredVotes}</>;
                                } else {
                                  return <>...</>;
                                }
                              })()}{' '}
                              sponsored votes
                            </>
                          )}
                        </>
                      )}
                    </strong>
                  </h4>
                  {props.candidate.proposerVotes > 0 && !props.isUpdateToProposal && (
                    <p className={classes.proposerVotesLabel}>
                      <Trans>
                        Proposer has {props.candidate.proposerVotes} vote
                        {props.candidate.proposerVotes > 1 ? 's' : ''}
                      </Trans>
                    </p>
                  )}
                  <p className={classes.subhead}>
                    {isThresholdMet && !props.isUpdateToProposal ? (
                      <Trans>
                        This candidate has met the required threshold, but Nouns voters can still
                        add support until it’s put onchain.
                      </Trans>
                    ) : (
                      <>
                        {props.isUpdateToProposal ? (
                          <Trans>
                            Update proposal candidates must be re-signed by the original signers.
                          </Trans>
                        ) : (
                          <Trans>
                            Proposal candidates must meet the required Nouns vote threshold.
                          </Trans>
                        )}
                      </>
                    )}
                  </p>
                  <ul className={classes.sponsorsList}>
                    {signatures.map(signature => {
                      const sigVoteCount = signature.signer.voteCount || 0;
                      if (!sigVoteCount || !activePendingProposers) return null;
                      if (signature.canceled) return null;
                      return (
                        <Signature
                          key={signature.signer.id}
                          reason={signature.reason}
                          voteCount={sigVoteCount}
                          expirationTimestamp={signature.expirationTimestamp}
                          signer={signature.signer.id}
                          isAccountSigner={
                            signature.signer.id.toLowerCase() === account?.toLowerCase()
                          }
                          sig={signature.sig}
                          setDataFetchPollInterval={props.setDataFetchPollInterval}
                          signerHasActiveOrPendingProposal={
                            signature.signer.activeOrPendingProposal
                          }
                          isUpdateToProposal={props.isUpdateToProposal}
                          isParentProposalUpdatable={isParentProposalUpdatable}
                          handleRefetchCandidateData={refetchData}
                          setIsAccountSigner={setIsAccountSigner}
                          handleSignatureRemoved={handleSignatureRemoved}
                        />
                      );
                    })}
                    {props.isUpdateToProposal ? (
                      <>
                        {props.originalProposal?.signers.map((ogSigner, i) => {
                          const sigVoteCount =
                            originalSignersDelegateSnapshot.data?.delegates?.find(
                              delegate => delegate.id === ogSigner.id,
                            )?.nounsRepresented.length;
                          if (signers?.includes(ogSigner.id.toLowerCase())) return null;
                          if (!sigVoteCount || !activePendingProposers) return null;
                          return (
                            <OriginalSignature
                              key={i}
                              signer={ogSigner.id}
                              voteCount={sigVoteCount}
                              isParentProposalUpdatable={isParentProposalUpdatable}
                            />
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {props.candidate.requiredVotes > props.candidate.voteCount &&
                          Array(props.candidate.requiredVotes - props.candidate.voteCount)
                            .fill('')
                            .map((_s, i) => (
                              <li className={classes.placeholder} key={i}>
                                {' '}
                              </li>
                            ))}
                      </>
                    )}
                    {props.isUpdateToProposal && !isParentProposalUpdatable ? (
                      <p className={classes.inactiveCandidate}>
                        <strong>
                          <Link to={`/vote/${props.originalProposal?.id}`}>
                            Proposal {props.originalProposal?.id}
                          </Link>
                        </strong>{' '}
                        is no longer updatable
                      </p>
                    ) : (
                      <>
                        {props.isProposer && isThresholdMet ? (
                          <>
                            {/* no sign button for proposers */}
                            <button
                              className={classes.button}
                              onClick={() => {
                                if (props.isUpdateToProposal) {
                                  setIsUpdateModalOpen(true);
                                } else {
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              Submit onchain
                            </button>
                          </>
                        ) : (
                          <>
                            {((!props.isUpdateToProposal &&
                              !isAccountSigner &&
                              !props.candidate.isProposal) ||
                              (props.isUpdateToProposal &&
                                isOriginalSigner &&
                                !isAccountSigner)) && (
                              <>
                                {!props.isProposer && connectedAccountNounVotes > 0 ? (
                                  <button
                                    className={classes.button}
                                    onClick={() => setIsFormDisplayed(!isFormDisplayed)}
                                  >
                                    {props.isUpdateToProposal ? 'Re-sign' : 'Sponsor'}
                                  </button>
                                ) : (
                                  <div className={classes.withoutVotesMsg}>
                                    <p>
                                      <Trans>
                                        Sponsoring a proposal requires at least one Noun vote
                                      </Trans>
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </>
              ) : (
                <AnimatePresence>
                  {addSignatureTransactionState === 'Success' && (
                    <div className="transactionStatus success">
                      <p>Success!</p>
                    </div>
                  )}
                  {isFormDisplayed ? (
                    <motion.div
                      className={classes.formOverlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button
                        className={classes.closeButton}
                        onClick={() => {
                          setIsFormDisplayed(false);
                          props.setDataFetchPollInterval(0);
                        }}
                      >
                        &times;
                      </button>
                      <SignatureForm
                        id={props.id}
                        transactionState={addSignatureTransactionState}
                        setTransactionState={setAddSignatureTransactionState}
                        setIsFormDisplayed={setIsFormDisplayed}
                        candidate={props.candidate}
                        handleRefetchCandidateData={props.handleRefetchCandidateData}
                        setDataFetchPollInterval={props.setDataFetchPollInterval}
                        proposalIdToUpdate={
                          props.originalProposal?.id ? +props.originalProposal?.id : 0
                        }
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              )}
            </>
          ) : (
            <img
              src="/loading-noggles.svg"
              alt="loading"
              className={classes.transactionModalSpinner}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateSponsors;
