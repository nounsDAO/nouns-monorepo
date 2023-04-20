import React from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import { useBlockNumber } from '@usedapp/core';
import { CandidateSignature } from '../../utils/types';
import dayjs from 'dayjs';
import { useEthers } from '@usedapp/core';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import { useQuery } from '@apollo/client';
import {
  Delegates,
  currentlyDelegatedNouns,
  delegateNounsAtBlockQuery,
} from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';

type CandidateSignatureProps = {
  signature: CandidateSignature;
};

const Signature: React.FC<CandidateSignatureProps> = props => {
  const [isReasonShown, setIsReasonShown] = React.useState(false);
  dayjs.extend(relativeTime);
  const expiration = dayjs().to(dayjs.unix(props.signature.expirationTimestamp.toNumber()));
  // get votes for signer
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery([props.signature.signer], blockNumber || 0),
  );
  const handleRemoveSignature = () => {
    // TODO: add functionality to remove signature
    console.log('remove signature');
  };

  return (
    <li className={classes.sponsor}>
      <div className={classes.details}>
        <div className={classes.sponsorInfo}>
          {/* TODO: truncate long names */}
          <p className={classes.sponsorName}>
            <a
              href={buildEtherscanAddressLink(props.signature.signer)}
              target={'_blank'}
              rel="noreferrer"
            >
              <ShortAddress address={props.signature.signer} />
            </a>
          </p>
          <p className={classes.expiration}>expires {expiration}</p>
        </div>
        <p className={classes.voteCount}>
          {delegateSnapshot?.delegates[0]?.nounsRepresented.length} votes
        </p>
      </div>

      {props.signature.reason && (
        <div className={classes.reason} onClick={() => setIsReasonShown(!isReasonShown)}>
          <div className={clsx(classes.reasonWrapper, isReasonShown && classes.reasonShown)}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non
              metus auctor fringilla.
            </p>
          </div>
          {!isReasonShown && (
            <button className={classes.readMore} onClick={() => {}}>
              more
            </button>
          )}
        </div>
      )}
      {account === props.signature.signer && (
        <div className={classes.removeSignature}>
          <button onClick={() => handleRemoveSignature()}>Remove sponsorship</button>
        </div>
      )}
    </li>
  );
};

export default Signature;
