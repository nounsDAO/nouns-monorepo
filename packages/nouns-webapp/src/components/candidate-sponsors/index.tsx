import React, { useMemo, useState } from 'react';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { AnimatePresence, motion } from 'motion/react';
import { isNullish } from 'remeda';
import { useAccount } from 'wagmi';

import { cn } from '@/lib/utils';
import { useDelegateNounsAtBlockQuery, useUserVotes } from '@/wrappers/noun-token';
import { Proposal, ProposalState } from '@/wrappers/nouns-dao';
import { ProposalCandidate } from '@/wrappers/nouns-data';
import { Link } from 'react-router';

import classes from './candidate-sponsors.module.css';
import OriginalSignature from './original-signature';
import SelectSponsorsToPropose from './select-sponsors-to-propose';
import Signature from './signature';
import SignatureForm from './signature-form';
import SubmitUpdateProposal from './submit-update-proposal';

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

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  // Derived flags
  const { address: account } = useAccount();
  const connectedAccountNounVotes = useUserVotes() ?? 0;
  const originalSigners = props.originalProposal?.signers.map(signer => signer.id.toLowerCase());
  const originalSignersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    originalSigners ?? [],
    BigInt(props.blockNumber ?? 0),
  );
  const signatures = props.candidate.version.content.contentSignatures ?? [];
  const signers = signatures.map(signature => signature.signer.id.toLowerCase());
  const isParentProposalUpdatable = props.originalProposal?.status === ProposalState.UPDATABLE;

  const isThresholdMet = useMemo(() => {
    if (!isNullish(props.originalProposal?.signers)) {
      return signatures.length >= (props.originalProposal?.signers?.length ?? 0);
    }
    return (
      props.candidate.proposerVotes + props.candidate.voteCount >= props.candidate.requiredVotes
    );
  }, [
    props.candidate.proposerVotes,
    props.candidate.voteCount,
    props.candidate.requiredVotes,
    props.originalProposal?.signers,
    signatures,
  ]);

  const isOriginalSigner = useMemo(() => {
    if (!account) return false;
    return originalSigners?.includes(account.toLowerCase()) ?? false;
  }, [account, originalSigners]);

  const isAccountSigner = useMemo(() => {
    if (!account) return false;
    return (
      signatures?.some(signature => signature.signer.id.toLowerCase() === account.toLowerCase()) ??
      false
    );
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
      {props.isUpdateToProposal === true && (
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
          className={cn(
            classes.interiorWrapper,
            isFormDisplayed ? classes.formOverlayVisible : undefined,
          )}
        >
          {Array.isArray(signatures) ? (
            <>
              {!isFormDisplayed ? (
                <>
                  <h4 className={classes.header}>
                    <strong>
                      {Boolean(props.isUpdateToProposal) ? (
                        <>
                          {props.candidate.voteCount >= 0 ? props.candidate.voteCount : '...'} of{' '}
                          {props.originalProposal?.signers
                            ? props.originalProposal.signers.length
                            : '...'}{' '}
                          original signed votes
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
                  {props.candidate.proposerVotes > 0 && props.isUpdateToProposal !== true && (
                    <p className={classes.proposerVotesLabel}>
                      <Trans>
                        Proposer has {props.candidate.proposerVotes} vote
                        {props.candidate.proposerVotes > 1 ? 's' : ''}
                      </Trans>
                    </p>
                  )}
                  <p className={classes.subhead}>
                    {isThresholdMet && props.isUpdateToProposal !== true ? (
                      <Trans>
                        This candidate has met the required threshold, but Nouns voters can still
                        add support until it’s put onchain.
                      </Trans>
                    ) : (
                      <>
                        {Boolean(props.isUpdateToProposal) ? (
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
                      const sigVoteCount = signature.signer.voteCount ?? 0;
                      if (sigVoteCount <= 0) return null;
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
                    {props.isUpdateToProposal === true ? (
                      <>
                        {props.originalProposal?.signers.map((ogSigner, i) => {
                          const sigVoteCount =
                            originalSignersDelegateSnapshot.data?.delegates?.find(
                              delegate => delegate.id === ogSigner.id,
                            )?.nounsRepresented.length ?? 0;
                          if (signers?.includes(ogSigner.id.toLowerCase())) return null;
                          if (sigVoteCount <= 0) return null;
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
                    {props.isUpdateToProposal === true && !isParentProposalUpdatable ? (
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
                                if (props.isUpdateToProposal === true) {
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
                            {((props.isUpdateToProposal === false &&
                              !isAccountSigner &&
                              !props.candidate.isProposal) ||
                              (props.isUpdateToProposal === true &&
                                isOriginalSigner &&
                                !isAccountSigner)) && (
                              <>
                                {!props.isProposer && connectedAccountNounVotes > 0 ? (
                                  <button
                                    className={classes.button}
                                    onClick={() => setIsFormDisplayed(!isFormDisplayed)}
                                  >
                                    {props.isUpdateToProposal === true ? 'Re-sign' : 'Sponsor'}
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
