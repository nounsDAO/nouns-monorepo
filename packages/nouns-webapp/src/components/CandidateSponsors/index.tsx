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
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import SignatureForm from './SignatureForm';
import { useEthers } from '@usedapp/core';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Proposal } from '../../wrappers/nounsDao';

interface CandidateSponsorsProps {
  slug: string;
  delegateSnapshot?: Delegates;
  signatures?: CandidateSignature[];
  isProposer: boolean;
}

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const [requiredVotes, setRequiredVotes] = React.useState<number>(5);
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  useEffect(() => {
    props.delegateSnapshot?.delegates?.map((delegate: { nounsRepresented: any }) => {
      setSignedVotes(signedVotes => signedVotes + delegate.nounsRepresented.length);
    });
  }, [props.delegateSnapshot]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.interiorWrapper}>
        {signedVotes >= requiredVotes && (
          <p className={classes.thresholdMet}>
            <FontAwesomeIcon icon={faCircleCheck} /> Sponsor threshold met
          </p>
        )}
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
          {props.signatures &&
            props.signatures.map(signature => <Signature signature={signature} />)}
          {/* TODO: check this against num of votes instead of num of sigs */}
          {props.signatures &&
            signedVotes < requiredVotes &&
            Array(requiredVotes - props.signatures.length)
              .fill('')
              .map((_s, i) => <li className={classes.placeholder}> </li>)}

          {props.isProposer && signedVotes >= requiredVotes ? (
            <button className={classes.button} onClick={() => setIsFormDisplayed(!isFormDisplayed)}>
              Submit on-chain
            </button>
          ) : (
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
        </ul>
        <AnimatePresence>
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
              <SignatureForm />
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
