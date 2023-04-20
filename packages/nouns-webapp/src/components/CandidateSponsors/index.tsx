import React, { useEffect } from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import CandidateSponsorship from './Signature';
import Signature from './Signature';
import { BigNumber } from 'ethers';
import { CandidateSignature } from '../../utils/types';
import { useQuery } from '@apollo/client';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import { useBlockNumber } from '@usedapp/core';
import { useUserVotes } from '../../wrappers/nounToken';
import { Trans } from '@lingui/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import SignatureForm from './SignatureForm';

interface CandidateSponsorsProps {
  slug: string;
  delegateSnapshot?: Delegates;
  signatures?: CandidateSignature[];
}

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const [requiredVotes, setRequiredVotes] = React.useState<number>(5);
  const blockNumber = useBlockNumber();
  const connectedAccountNounVotes = useUserVotes() || 0;
  useEffect(() => {
    props.delegateSnapshot?.delegates?.map((delegate: { nounsRepresented: any }) => {
      setSignedVotes(signedVotes => signedVotes + delegate.nounsRepresented.length);
    });
  }, [props.delegateSnapshot]);

  return (
    <div className={classes.wrapper}>
      {signedVotes >= requiredVotes && <p className={classes.thresholdMet}></p>}
      <h4 className={classes.header}>
        <strong>{signedVotes} of 5 Sponsored Votes</strong>
      </h4>
      <p className={classes.subhead}>
        {signedVotes >= requiredVotes ? (
          <Trans>
            This candidate has met the required threshold, but Nouns voters can still add support
            until it’s put on-chain.
          </Trans>
        ) : (
          <>Proposal candidates must meet the required Nouns vote threshold.</>
        )}
      </p>

      <ul className={classes.sponsorsList}>
        {props.signatures && props.signatures.map(signature => <Signature signature={signature} />)}
        {/* TODO: check this against num of votes instead of num of sigs */}
        {props.signatures &&
          signedVotes < requiredVotes &&
          Array(requiredVotes - props.signatures.length)
            .fill('')
            .map((_s, i) => <li className={classes.placeholder}> </li>)}

        {connectedAccountNounVotes > 0 ? (
          <button className={classes.button}>Sponsor</button>
        ) : (
          <div className={classes.withoutVotesMsg}>
            <p>
              <Trans>Sponsoring a proposal requires at least one Noun vote</Trans>
            </p>
          </div>
        )}
      </ul>

      <SignatureForm />
    </div>
  );
};

export default CandidateSponsors;
