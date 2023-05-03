import React from 'react';
import classes from './CandidateSponsors.module.css';
import clsx from 'clsx';
import { useBlockNumber } from '@usedapp/core';
import { CandidateSignature, useCancelSignature } from '../../wrappers/nounsDao';
import dayjs, { locale } from 'dayjs';
import en from 'dayjs/locale/en';
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
import { SUPPORTED_LOCALE_TO_DAYSJS_LOCALE } from '../../i18n/locales';
import { useActiveLocale } from '../../hooks/useActivateLocale';

type CandidateSignatureProps = {
  reason: string;
  expirationTimestamp: number;
  signer: string;
  isAccountSigner: boolean;
  sig: string;
};

const Signature: React.FC<CandidateSignatureProps> = props => {
  const [isReasonShown, setIsReasonShown] = React.useState(false);
  dayjs.extend(relativeTime);
  const expiration = dayjs(dayjs.unix(props.expirationTimestamp / 1000)).fromNow();
  console.log('expiration', expiration);
  console.log('props.expirationTimestamp', props.expirationTimestamp / 1000);
  // get votes for signer
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery([props.signer], blockNumber || 0),
  );
  const handleRemoveSignature = () => {
    // TODO: add functionality to remove signature
    console.log('remove signature');
  };

  const { cancelSig, cancelSigState } = useCancelSignature();
  console.log('cancelSigState', cancelSigState);
  async function cancel() {
    // await
    await cancelSig(props.sig);
  }

  return (
    <li className={classes.sponsor}>
      <div className={classes.details}>
        <div className={classes.sponsorInfo}>
          {/* TODO: truncate long names */}
          <p className={classes.sponsorName}>
            <a href={buildEtherscanAddressLink(props.signer)} target={'_blank'} rel="noreferrer">
              <ShortAddress address={props.signer} />
            </a>
          </p>
          <p className={classes.expiration}>Expires {expiration}</p>
        </div>
        <p className={classes.voteCount}>
          {delegateSnapshot?.delegates[0]?.nounsRepresented.length} votes
        </p>
      </div>
      {props.reason && (
        <div className={classes.reason} onClick={() => setIsReasonShown(!isReasonShown)}>
          <div
            className={clsx(
              classes.reasonWrapper,
              isReasonShown && props.reason.length > 50 && classes.reasonShown,
            )}
          >
            <p>{props.reason}</p>
          </div>
          {!isReasonShown && props.reason.length > 50 && (
            <button className={classes.readMore} onClick={() => {}}>
              more
            </button>
          )}
        </div>
      )}
      {props.isAccountSigner && (
        <div className={classes.removeSignature}>
          <button onClick={() => cancel()}>Remove sponsorship</button>
        </div>
      )}
    </li>
  );
};

export default Signature;
