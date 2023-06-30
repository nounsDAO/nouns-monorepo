import React from 'react';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { CandidateSignature } from '../../wrappers/nounsData';
import { ProposalCandidate } from '../../wrappers/nounsData';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Delegates } from '../../wrappers/subgraph';
import { useDelegateNounsAtBlockQuery, useUserVotes } from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import classes from './CandidateSponsors.module.css';
import Signature from './Signature';
import SignatureForm from './SignatureForm';
import SelectSponsorsToPropose from './SelectSponsorsToPropose';

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
}

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

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const [isAccountSigner, setIsAccountSigner] = React.useState<boolean>(false);
  const [signatures, setSignatures] = useState<CandidateSignature[]>([]);
  const [isCancelOverlayVisible, setIsCancelOverlayVisible] = useState<boolean>(false);
  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const signers = deDupeSigners(props.candidate.version.versionSignatures?.map(signature => signature.signer.id));
  const delegateSnapshot = useDelegateNounsAtBlockQuery(signers, props.currentBlock);
  const handleSignerCountDecrease = (decreaseAmount: number) => {
    setSignedVotes(signedVotes => signedVotes - decreaseAmount);
  };
  const filterSignersByVersion = (delegateSnapshot: Delegates) => {
    const activeSigs = props.candidate.version.versionSignatures.filter(sig => sig.canceled === false)
    let votes = 0;
    const sigs = activeSigs.map((signature, i) => {
      if (signature.expirationTimestamp < Math.round(Date.now() / 1000)) {
        activeSigs.splice(i, 1);
      }
      if (signature.signer.id.toLowerCase() === account?.toLowerCase()) {
        setIsAccountSigner(true);
      }
      delegateSnapshot.delegates?.map(delegate => {
        if (delegate.id === signature.signer.id) {
          votes += delegate.nounsRepresented.length;
        }
        return delegate;
      });
      return signature;
    });
    setSignedVotes(votes);
    return sigs;
  };

  const handleSignatureRemoved = () => {
    setIsAccountSigner(false);
    handleSignerCountDecrease(1);
  }

  useEffect(() => {
    if (delegateSnapshot.data && !isCancelOverlayVisible) {
      setSignatures(filterSignersByVersion(delegateSnapshot.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.candidate, delegateSnapshot.data, isCancelOverlayVisible]);

  const [addSignatureTransactionState, setAddSignatureTransactionState] = useState<
    'None' | 'Success' | 'Mining' | 'Fail' | 'Exception'
  >('None');



  return (
    <>
      {delegateSnapshot.data && (
        <SelectSponsorsToPropose
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          signatures={signatures}
          delegateSnapshot={delegateSnapshot.data}
          requiredVotes={props.requiredVotes}
          candidate={props.candidate}
        />
      )}

      <div className={classes.wrapper}>
        <div className={classes.interiorWrapper}>
          {props.requiredVotes && signedVotes >= props.requiredVotes && (
            <p className={classes.thresholdMet}>
              <FontAwesomeIcon icon={faCircleCheck} /> Sponsor threshold met
            </p>
          )}
          <h4 className={classes.header}>
            <strong>
              {signedVotes >= 0 ? signedVotes : '...'} of {props.requiredVotes || '...'} Sponsored Votes
            </strong>
          </h4>
          <p className={classes.subhead}>
            {props.requiredVotes && signedVotes >= props.requiredVotes ? (
              <Trans>
                This candidate has met the required threshold, but Nouns voters can still add support
                until it’s put on-chain.
              </Trans>
            ) : (
              <>Proposal candidates must meet the required Nouns vote threshold.</>
            )}
          </p>
          <ul className={classes.sponsorsList}>
            {signatures &&
              signatures.map(signature => {
                const voteCount = delegateSnapshot.data?.delegates?.find(
                  delegate => delegate.id === signature.signer.id,
                )?.nounsRepresented.length;
                if (!voteCount) return null;
                if (signature.canceled) return null;
                return (
                  <Signature
                    key={signature.signer.id}
                    reason={signature.reason}
                    voteCount={voteCount}
                    expirationTimestamp={signature.expirationTimestamp}
                    signer={signature.signer.id}
                    isAccountSigner={isAccountSigner && signature.signer.id.toLowerCase() === account?.toLowerCase()}
                    sig={signature.sig}
                    handleSignerCountDecrease={handleSignerCountDecrease}
                    handleRefetchCandidateData={props.handleRefetchCandidateData}
                    setIsAccountSigner={setIsAccountSigner}
                    handleSignatureRemoved={handleSignatureRemoved}
                    setIsCancelOverlayVisible={setIsCancelOverlayVisible}
                  />
                );
              })}
            {signatures &&
              props.requiredVotes &&
              signedVotes < props.requiredVotes &&
              Array(props.requiredVotes - signatures.length)
                .fill('')
                .map((_s, i) => <li className={classes.placeholder} key={i}> </li>)}

            {props.isProposer && props.requiredVotes && signedVotes >= props.requiredVotes ? (
              <>
                <button className={classes.button}
                  onClick={() => setIsModalOpen(true)}>
                  Submit on-chain
                </button>
                {!isAccountSigner && connectedAccountNounVotes > 0 && (
                  <button
                    className={classes.button}
                    onClick={() => setIsFormDisplayed(!isFormDisplayed)}
                  >
                    Sponsor
                  </button>
                )}
              </>
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
                <button className={classes.closeButton} onClick={() => {
                  setIsFormDisplayed(false);
                  props.setDataFetchPollInterval(0);
                }}>
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
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className={classes.aboutText}>
          <p>
            <strong><Trans>About sponsoring proposal candidates</Trans></strong>
          </p>
          <p>
            <Trans>
              Once a signed proposal is on-chain, signers will need to wait until the proposal is queued
              or defeated before putting another proposal on-chain.
            </Trans>
          </p>
        </div>
      </div>
    </>
  );
};

export default CandidateSponsors;
