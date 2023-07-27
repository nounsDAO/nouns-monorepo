import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import { CandidateSignature, PartialProposalCandidate } from '../../wrappers/nounsData';
import CandidateSponsors from './CandidateSponsors';
import ShortAddress from '../ShortAddress';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Delegates } from '../../wrappers/subgraph';
import { useDelegateNounsAtBlockQuery } from '../../wrappers/nounToken';
import { PartialProposal, useActivePendingUpdatableProposers } from '../../wrappers/nounsDao';
import { relativeTimestamp } from '../../utils/timeUtils';

type Props = {
  candidate: PartialProposalCandidate;
  nounsRequired: number;
  latestProposal?: PartialProposal;
  currentBlock?: number;
};

const deDupeSigners = (signers: string[]) => {
  const uniqueSigners: string[] = [];
  signers.forEach(signer => {
    if (!uniqueSigners.includes(signer)) {
      uniqueSigners.push(signer);
    }
  });
  return uniqueSigners;
};

function CandidateCard(props: Props) {
  const [signedVotesCount, setSignedVotesCount] = useState<number>(0);
  const [signatures, setSignatures] = useState<CandidateSignature[]>([]);
  const [signers, setSigners] = useState<string[]>([]);
  const [proposerVoteCount, setProposerVoteCount] = useState<number>();
  const delegateSnapshot = useDelegateNounsAtBlockQuery(signers, props.currentBlock ?? 0);
  const activePendingProposers = useActivePendingUpdatableProposers(props.currentBlock ?? 0);
  const proposerDelegates =
    useDelegateNounsAtBlockQuery([props.candidate.proposer], props.currentBlock ?? 0) || 0;
  const filterSigners = (
    delegateSnapshot: Delegates,
    activePendingProposers: string[],
    signers: CandidateSignature[],
  ) => {
    const activeSigs = props.candidate.latestVersion.content.contentSignatures.filter(
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
        sigs.push(signature);
      }
    });
    return { sigs, voteCount };
  };

  useEffect(() => {
    if (delegateSnapshot.data && props.latestProposal && activePendingProposers.data) {
      const { sigs, voteCount } = filterSigners(
        delegateSnapshot.data,
        activePendingProposers.data,
        props.candidate.latestVersion.content.contentSignatures,
      );
      if (sigs.length !== signatures.length) {
        setSignatures(sigs);
      }
      if (voteCount !== signedVotesCount) {
        setSignedVotesCount(voteCount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.candidate, delegateSnapshot.data]);

  useEffect(() => {
    setSigners(
      deDupeSigners(
        props.candidate.latestVersion.content.contentSignatures?.map(
          signature => signature.signer.id,
        ),
      ),
    );
  }, [props.candidate.latestVersion.content.contentSignatures]);

  // get proposer votes on each card here to prevent inaccurate counts during loading
  useEffect(() => {
    if (proposerDelegates.data) {
      const voteCount = proposerDelegates.data.delegates[0]?.nounsRepresented.length;
      setProposerVoteCount(voteCount);
    }
  }, [proposerDelegates.data]);

  return (
    <Link
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      to={`/candidates/${props.candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{props.candidate.latestVersion.content.title}</span>
        </span>
        <p className={classes.proposer}>
          by{' '}
          <span className={classes.proposerAddress}>
            <ShortAddress address={props.candidate.proposer || ''} avatar={false} />
          </span>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors
              signers={signatures}
              nounsRequired={props.candidate.requiredVotes}
              currentBlock={props.currentBlock && props.currentBlock - 1}
              isThresholdMetByProposer={
                proposerVoteCount && proposerVoteCount >= props.candidate.requiredVotes
                  ? true
                  : false
              }
            />
            {proposerDelegates.data ? (
              <span
                className={clsx(
                  classes.sponsorCount,
                  signers.length - props.candidate.requiredVotes > 0 &&
                    classes.sponsorCountOverflow,
                )}
              >
                <strong>
                  {signedVotesCount >= 0 ? signedVotesCount : '...'} /{' '}
                  {proposerVoteCount && proposerVoteCount > props.candidate.requiredVotes ? (
                    <em className={classes.naVotesLabel}>n/a</em>
                  ) : (
                    props.candidate.requiredVotes
                  )}
                </strong>{' '}
                <Trans>sponsored votes</Trans>
              </span>
            ) : (
              <>...</>
            )}
          </div>
          <p className={classes.timestamp}>
            {relativeTimestamp(props.candidate.lastUpdatedTimestamp)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CandidateCard;
