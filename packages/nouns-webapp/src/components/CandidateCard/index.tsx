import classes from './CandidateCard.module.css';
import clsx from 'clsx';
import { CandidateSignature, PartialProposalCandidate } from '../../wrappers/nounsData';
import CandidateSponsors from './CandidateSponsors';
import ShortAddress from '../ShortAddress';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { useState, useEffect } from 'react';
import { Delegates } from '../../wrappers/subgraph';
import { useDelegateNounsAtBlockQuery } from '../../wrappers/nounToken';
import { useBlockNumber } from '@usedapp/core';
import { checkHasActiveOrPendingProposalOrCandidate } from '../../utils/proposals';
import { PartialProposal } from '../../wrappers/nounsDao';

type Props = {
  candidate: PartialProposalCandidate;
  nounsRequired: number;
  latestProposal?: PartialProposal;
};

const deDupeSigners = (signers: string[]) => {
  const uniqueSigners: string[] = [];
  signers.forEach(signer => {
    if (!uniqueSigners.includes(signer)) {
      uniqueSigners.push(signer);
    }
  }
  );
  return uniqueSigners;
}

function CandidateCard(props: Props) {
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [signedVotes, setSignedVotes] = useState<number>(0);
  const [signatures, setSignatures] = useState<CandidateSignature[]>([]);
  const signers = deDupeSigners(props.candidate.latestVersion.versionSignatures?.map(signature => signature.signer.id));
  const delegateSnapshot = useDelegateNounsAtBlockQuery(signers, currentBlock ?? 0);
  const blockNumber = useBlockNumber();
  const hasActiveOrPendingProposal = (latestProposal: PartialProposal, account: string) => {
    const status = checkHasActiveOrPendingProposalOrCandidate(
      latestProposal.status,
      latestProposal.id,
      account,
    );
    return status;
  };

  const filterSigners = (delegateSnapshot: Delegates, latestProposal?: PartialProposal) => {
    const activeSigs = props.candidate.latestVersion.versionSignatures.filter(sig => sig.canceled === false && sig.expirationTimestamp > Math.round(Date.now() / 1000))
    console.log('activeSigs', activeSigs);
    console.log('props.candidate.latestVersion.versionSignatures', props.candidate.latestVersion.versionSignatures);
    console.log('delegateSnapshot', delegateSnapshot.delegates);
    let votes = 0;
    const sigs = activeSigs.filter((signature, i) => {
      // don't count votes from signers who have active or pending proposals
      if (latestProposal && !hasActiveOrPendingProposal(latestProposal, signature.signer.id)) {
        delegateSnapshot.delegates?.map(delegate => {
          console.log('delegate', delegate);
          if (delegate.id === signature.signer.id) {
            console.log('delegate match', delegate);
            votes += delegate.nounsRepresented.length;
          }
          return null;
        });
      }
      // still return signature so we can show it with a label
      return signature;
    });
    setSignedVotes(votes);
    return sigs;
  };

  useEffect(() => {
    if (delegateSnapshot.data) {
      props.latestProposal && setSignatures(filterSigners(delegateSnapshot.data, props.latestProposal));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.candidate, delegateSnapshot.data]);

  useEffect(() => {
    // prevent live-updating the block resulting in undefined block number
    if (blockNumber && !currentBlock) {
      setCurrentBlock(blockNumber);
    }
  }, [blockNumber, currentBlock]);

  return (
    <Link
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      to={`/candidates/${props.candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{props.candidate.latestVersion.title}</span>
        </span>
        <p className={classes.proposer}>
          by{' '}
          <a
            href={buildEtherscanAddressLink(props.candidate.proposer || '')}
            target="_blank"
            rel="noreferrer"
          >
            <ShortAddress address={props.candidate.proposer || ''} avatar={false} />
          </a>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors
              signers={signatures}
              nounsRequired={props.nounsRequired}
              currentBlock={currentBlock && currentBlock - 1}
            />
            <span className={clsx(classes.sponsorCount,
              signers.length - props.nounsRequired > 0 && classes.sponsorCountOverflow
            )}>
              <strong>
                {signedVotes} / {props.nounsRequired}
              </strong>{' '}
              <Trans>sponsors</Trans>
            </span>
          </div>
          <p className={classes.timestamp}>
            {dayjs.unix(props.candidate.lastUpdatedTimestamp).fromNow()}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CandidateCard;
