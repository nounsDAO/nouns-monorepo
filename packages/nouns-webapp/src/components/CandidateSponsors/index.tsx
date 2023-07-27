import React from 'react';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { CandidateSignature } from '../../wrappers/nounsData';
import { ProposalCandidate } from '../../wrappers/nounsData';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Delegates } from '../../wrappers/subgraph';
import {
  useAccountVotes,
  useDelegateNounsAtBlockQuery,
  useUserVotes,
} from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { checkHasActiveOrPendingProposalOrCandidate } from '../../utils/proposals';
import {
  Proposal,
  ProposalState,
  useActivePendingUpdatableProposers,
} from '../../wrappers/nounsDao';
import classes from './CandidateSponsors.module.css';
import Signature from './Signature';
import SignatureForm from './SignatureForm';
import SelectSponsorsToPropose from './SelectSponsorsToPropose';
import clsx from 'clsx';
import SubmitUpdateProposal from './SubmitUpdateProposal';
import OriginalSignature from './OriginalSignature';
import { Link } from 'react-router-dom';

interface CandidateSponsorsProps {
  candidate: ProposalCandidate;
  slug: string;
  isProposer: boolean;
  id: string;
  handleRefetchCandidateData: Function;
  setDataFetchPollInterval: Function;
  currentBlock: number;
  requiredVotes: number;
  userVotes: number;
  isSignerWithActiveOrPendingProposal?: boolean;
  latestProposal?: Proposal;
  isUpdateToProposal?: boolean;
  originalProposal?: Proposal;
}

const deDupeSigners = (signers: string[]) => {
  const uniqueSigners: string[] = [];
  signers.forEach(signer => {
    if (!uniqueSigners.includes(signer)) {
      uniqueSigners.push(signer);
    }
  });
  return uniqueSigners;
};

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotesCount, setSignedVotesCount] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const [isAccountSigner, setIsAccountSigner] = React.useState<boolean>(false);
  const [isOriginalSigner, setIsOriginalSigner] = useState<boolean>(false);
  const [isThresholdMet, setIsThresholdMet] = React.useState<boolean>(false);
  const [signatures, setSignatures] = useState<CandidateSignature[]>([]);
  const [isCancelOverlayVisible, setIsCancelOverlayVisible] = useState<boolean>(false);
  const [blockNumber, setBlockNumber] = useState<number>();
  const [signers, setSigners] = useState<string[]>();
  const [originalSigners, setOriginalSigners] = useState<string[]>();
  const { account } = useEthers();
  const activePendingProposers = useActivePendingUpdatableProposers(blockNumber ?? 0);
  const connectedAccountNounVotes = useUserVotes() || 0;
  const proposerNounVotes = useAccountVotes(props.candidate.proposer) || 0;
  const delegateSnapshot = useDelegateNounsAtBlockQuery(signers ?? [], blockNumber ?? 0);
  const originalSignersDelegateSnapshot = useDelegateNounsAtBlockQuery(
    originalSigners ?? [],
    blockNumber ?? 0,
  );
  const hasActiveOrPendingProposal = (latestProposal: Proposal, account: string) => {
    const status = checkHasActiveOrPendingProposalOrCandidate(
      latestProposal.status,
      latestProposal.id,
      account,
    );
    return status;
  };
  const isParentProposalUpdatable =
    props.originalProposal?.status !== ProposalState.UPDATABLE ? false : true;
  const filterSigners = (
    delegateSnapshot: Delegates,
    activePendingProposers: string[],
    signers: CandidateSignature[],
  ) => {
    const activeSigs = signers.filter(
      sig => sig.canceled === false && sig.expirationTimestamp > Math.round(Date.now() / 1000),
    );
    let voteCount = 0;
    let sigs: CandidateSignature[] = [];
    activeSigs.forEach(signature => {
      // don't count votes from signers who have active or pending proposals
      if (!activePendingProposers.includes(signature.signer.id)) {
        const delegateVoteCount =
          delegateSnapshot.delegates?.find(delegate => delegate.id === signature.signer.id)
            ?.nounsRepresented.length || 0;
        voteCount += delegateVoteCount;
      }
      sigs.push(signature);
    });
    return { sigs, voteCount };
  };

  useEffect(() => {
    if (
      delegateSnapshot.data &&
      !isCancelOverlayVisible &&
      props.latestProposal &&
      activePendingProposers.data
    ) {
      const { sigs, voteCount } = filterSigners(
        delegateSnapshot.data,
        activePendingProposers.data,
        props.candidate.version.content.contentSignatures,
      );
      if (sigs.length !== signatures.length) {
        setSignatures(sigs);
      }
      // if updateProposal
      if (props.isUpdateToProposal) {
        // no need to filter out signers with active or pending proposals here
        const activeSigs = props.candidate.version.content.contentSignatures.filter(
          sig => sig.canceled === false && sig.expirationTimestamp > Math.round(Date.now() / 1000),
        );
        setSignedVotesCount(activeSigs.length);
        props.originalProposal?.signers &&
          setIsThresholdMet(
            activeSigs.length >= props.originalProposal?.signers?.length ? true : false,
          );
        const dedupedSigners =
          props.originalProposal?.signers &&
          deDupeSigners(props.originalProposal?.signers?.map(signature => signature.id));
        if (originalSigners?.length !== dedupedSigners?.length) {
          setOriginalSigners(dedupedSigners);
        }
      } else {
        if (props.candidate.proposerVotes >= props.requiredVotes) {
          setIsThresholdMet(true);
        } else {
          setIsThresholdMet(voteCount >= props.candidate.requiredVotes ? true : false);
        }
        if (voteCount !== signedVotesCount) {
          setSignedVotesCount(voteCount);
        }
      }
    }
    const dedupedSigners = deDupeSigners(
      props.candidate.version.content.contentSignatures?.map(signature => signature.signer.id),
    );
    if (signers?.length !== dedupedSigners.length) {
      setSigners(dedupedSigners);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.candidate,
    delegateSnapshot.data,
    isCancelOverlayVisible,
    props.latestProposal,
    activePendingProposers.data,
    signedVotesCount,
    props.candidate.requiredVotes,
    signatures.length,
    signers?.length,
    proposerNounVotes,
  ]);

  useEffect(() => {
    if (!blockNumber) {
      setBlockNumber(props.currentBlock);
    }
  }, [blockNumber, props.currentBlock]);

  useEffect(() => {
    if (props.originalProposal && props.originalProposal.signers && account) {
      const originalSigners = props.originalProposal.signers.map(signer => signer.id.toLowerCase());
      if (originalSigners.includes(account.toLowerCase())) {
        setIsOriginalSigner(true);
      } else {
        setIsOriginalSigner(false);
      }
    }
  }, [props.originalProposal, account]);

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

  const handleSignatureRemoved = (voteCount: number) => {
    setSignedVotesCount(signedVotesCount - voteCount);
    setIsThresholdMet(signedVotesCount - voteCount >= props.candidate.requiredVotes ? true : false);
  };

  return (
    <>
      {delegateSnapshot.data && blockNumber && (
        <SelectSponsorsToPropose
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          signatures={signatures.filter(
            signature =>
              props.latestProposal &&
              !hasActiveOrPendingProposal(props.latestProposal, signature.signer.id) &&
              signature,
          )}
          delegateSnapshot={delegateSnapshot.data}
          requiredVotes={props.candidate.requiredVotes}
          candidate={props.candidate}
          blockNumber={blockNumber}
          setDataFetchPollInterval={props.setDataFetchPollInterval}
          handleRefetchCandidateData={props.handleRefetchCandidateData}
        />
      )}
      {delegateSnapshot.data && blockNumber && props.isUpdateToProposal && (
        <SubmitUpdateProposal
          isModalOpen={isUpdateModalOpen}
          setIsModalOpen={setIsUpdateModalOpen}
          signatures={signatures.filter(
            signature =>
              props.latestProposal &&
              !hasActiveOrPendingProposal(props.latestProposal, signature.signer.id) &&
              signature,
          )}
          candidate={props.candidate}
          blockNumber={blockNumber}
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
                          {signedVotesCount >= 0 ? signedVotesCount : '...'} of{' '}
                          {props.originalProposal?.signers.length || '...'} original signed votes
                        </>
                      ) : (
                        <>
                          {signedVotesCount === 0 &&
                          props.candidate.proposerVotes > props.candidate.requiredVotes ? (
                            <>
                              <Trans>No sponsored votes needed</Trans>
                            </>
                          ) : (
                            <>
                              {signedVotesCount >= 0 ? signedVotesCount : '...'} of{' '}
                              {props.candidate.proposerVotes > props.candidate.requiredVotes ? (
                                <em className={classes.naVotesLabel}>n/a</em>
                              ) : props.candidate.requiredVotes !== undefined ? (
                                props.candidate.requiredVotes
                              ) : (
                                '...'
                              )}{' '}
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
                    {signatures &&
                      signatures.map(signature => {
                        const sigVoteCount = delegateSnapshot.data?.delegates?.find(
                          delegate => delegate.id === signature.signer.id,
                        )?.nounsRepresented.length;
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
                              !props.isUpdateToProposal &&
                              activePendingProposers.data.includes(signature.signer.id)
                                ? true
                                : false
                            }
                            isUpdateToProposal={props.isUpdateToProposal}
                            isParentProposalUpdatable={isParentProposalUpdatable}
                            handleRefetchCandidateData={refetchData}
                            setIsAccountSigner={setIsAccountSigner}
                            setIsCancelOverlayVisible={setIsCancelOverlayVisible}
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
                        {props.candidate.requiredVotes > signedVotesCount &&
                          Array(props.candidate.requiredVotes - signedVotesCount)
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
                                props.isUpdateToProposal
                                  ? setIsUpdateModalOpen(true)
                                  : setIsModalOpen(true);
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
