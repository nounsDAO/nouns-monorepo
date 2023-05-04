import { JsonRpcSigner } from '@ethersproject/providers';
import { Trans } from '@lingui/macro';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { useCallback, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import config, { CHAIN_ID } from '../../config';
import { useAppDispatch } from '../../hooks';
import Section from '../../layout/Section';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import {
  useProposeBySigs,
  useUpdateProposalBySigs,
  CandidateSignature,
  useProposalThreshold,
  ProposalCandidate,
} from '../../wrappers/nounsDao';
import { useAddSignature, useCandidateProposal } from '../../wrappers/nounsData';
import { ethers } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { Proposal } from '../../wrappers/nounsDao';
import { Delegates, delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import React from 'react';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './CandidateSponsors.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Signature from './Signature';
import SignatureForm from './SignatureForm';
import { useQuery } from '@apollo/client';

interface CandidateSponsorsProps {
  candidate: ProposalCandidate;
  slug: string;
  // delegateSnapshot?: Delegates;
  signers: string[];
  signatures?: {
    reason: string;
    expirationTimestamp: number;
    sig: string;
    canceled: boolean;
    signer: {
      id: string;
      proposals: {
        id: string;
      }[];
    };
  }[];
  isProposer: boolean;
  id: string;
}

const domain = {
  name: 'Nouns DAO',
  chainId: CHAIN_ID,
  verifyingContract: config.addresses.nounsDAOProxy,
};

const createProposalTypes = {
  Proposal: [
    { name: 'proposer', type: 'address' },
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'signatures', type: 'string[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
    { name: 'expiry', type: 'uint256' },
  ],
};

const updateProposalTypes = {
  UpdateProposal: [
    { name: 'proposalId', type: 'uint256' },
    { name: 'proposer', type: 'address' },
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'signatures', type: 'string[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
    { name: 'expiry', type: 'uint256' },
  ],
};
const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const [signedVotes, setSignedVotes] = React.useState<number>(0);
  const [requiredVotes, setRequiredVotes] = React.useState<number>();
  const [isFormDisplayed, setIsFormDisplayed] = React.useState<boolean>(false);
  const blockNumber = useBlockNumber();
  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const [isAccountSigner, setIsAccountSigner] = React.useState<boolean>(false);
  const threshold = useProposalThreshold();
  const signers = props.candidate.version.versionSignatures?.map(signature => signature.signer.id);
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(signers, blockNumber ?? 0),
  );

  console.log('props.candidate', props.candidate, props.signatures);

  useEffect(() => {
    if (threshold !== undefined) {
      setRequiredVotes(threshold + 1);
    }
  }, [threshold]);

  useEffect(() => {
    if (props.signatures && signedVotes === 0) {
      props.signatures.map((signature, i) => {
        if (signature.expirationTimestamp < Math.round(Date.now() / 1000)) {
          props.signatures?.splice(i, 1);
        }
        if (signature.signer.id.toUpperCase() === account?.toUpperCase()) {
          setIsAccountSigner(true);
        }
        delegateSnapshot?.delegates?.map(delegate => {
          if (delegate.id === signature.signer.id) {
            setSignedVotes(signedVotes => signedVotes + delegate.nounsRepresented.length);
          }
        });
      });
    }
  }, [props.signatures, delegateSnapshot]);

  // POC code below
  const { library, chainId } = useEthers();
  const signer = library?.getSigner();

  const [expiry, setExpiry] = useState(Math.round(Date.now() / 1000) + 60 * 60 * 24);
  const [proposalIdToUpdate, setProposalIdToUpdate] = useState('');

  const candidateProposal = useCandidateProposal(props.id);
  const { addSignature, addSignatureState } = useAddSignature();

  async function calcProposalEncodeData(
    proposer: any,
    targets: any,
    values: any,
    signatures: any[],
    calldatas: any[],
    description: string,
  ) {
    const signatureHashes = signatures.map((sig: string) =>
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sig)),
    );

    const calldatasHashes = calldatas.map((calldata: ethers.utils.BytesLike) =>
      ethers.utils.keccak256(calldata),
    );

    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'bytes32', 'bytes32', 'bytes32', 'bytes32', 'bytes32'],
      [
        proposer,
        ethers.utils.keccak256(ethers.utils.solidityPack(['address[]'], [targets])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['uint256[]'], [values])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32[]'], [signatureHashes])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32[]'], [calldatasHashes])),
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description)),
      ],
    );

    return encodedData;
  }

  async function sign() {
    if (!candidateProposal) return;
    let signature;
    if (proposalIdToUpdate) {
      const value = {
        proposer: candidateProposal.proposer,
        targets: candidateProposal.latestVersion.targets,
        values: candidateProposal.latestVersion.values,
        signatures: candidateProposal.latestVersion.signatures,
        calldatas: candidateProposal.latestVersion.calldatas,
        description: candidateProposal.latestVersion.description,
        expiry: expiry,
        proposalId: proposalIdToUpdate,
      };
      signature = await signer!._signTypedData(domain, updateProposalTypes, value);
    } else {
      const value = {
        proposer: candidateProposal.proposer,
        targets: candidateProposal.latestVersion.targets,
        values: candidateProposal.latestVersion.values,
        signatures: candidateProposal.latestVersion.signatures,
        calldatas: candidateProposal.latestVersion.calldatas,
        description: candidateProposal.latestVersion.description,
        expiry: expiry,
      };
      signature = await signer!._signTypedData(domain, createProposalTypes, value);
    }

    const encodedProp = await calcProposalEncodeData(
      candidateProposal.proposer,
      candidateProposal.latestVersion.targets,
      candidateProposal.latestVersion.values,
      candidateProposal.latestVersion.signatures,
      candidateProposal.latestVersion.calldatas,
      candidateProposal.latestVersion.description,
    );

    console.log('>>>> encodedProp', encodedProp);

    console.log(
      '>> addSignature',
      signature,
      expiry,
      candidateProposal.proposer,
      candidateProposal.slug,
      encodedProp,
    );

    await addSignature(
      signature,
      expiry,
      candidateProposal.proposer,
      candidateProposal.slug,
      encodedProp,
      'TODO reason',
    );
    // const updatedDraftProposal = addSignature(
    //   {
    //     signer: await signer!.getAddress(),
    //     signature: signature!,
    //     expiry: expiry},
    //   proposalId);
    //   setDraftProposal(updatedDraftProposal);
  }

  const [isProposePending, setProposePending] = useState(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const { proposeBySigs, proposeBySigsState } = useProposeBySigs();
  const { updateProposalBySigs, updateProposalBySigState } = useUpdateProposalBySigs();

  useEffect(() => {
    switch (proposeBySigsState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Proposal Created!</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: proposeBySigsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: proposeBySigsState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [proposeBySigsState, setModal]);

  useEffect(() => {
    switch (updateProposalBySigState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: <Trans>Success</Trans>,
          message: <Trans>Proposal Updated!</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: <Trans>Transaction Failed</Trans>,
          message: updateProposalBySigState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: <Trans>Error</Trans>,
          message: updateProposalBySigState?.errorMessage || <Trans>Please try again.</Trans>,
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [updateProposalBySigState, setModal]);

  const submitProposalOnChain = async () => {
    await proposeBySigs(
      props.signatures?.map((s: any) => [s.sig, s.signer.id, s.expirationTimestamp]),
      candidateProposal?.latestVersion.targets,
      candidateProposal?.latestVersion.values,
      candidateProposal?.latestVersion.signatures,
      candidateProposal?.latestVersion.calldatas,
      candidateProposal?.latestVersion.description,
    );
  };
  return (
    <div className={classes.wrapper}>
      <div className={classes.interiorWrapper}>
        {requiredVotes && signedVotes >= requiredVotes && (
          <p className={classes.thresholdMet}>
            <FontAwesomeIcon icon={faCircleCheck} /> Sponsor threshold met
          </p>
        )}
        <h4 className={classes.header}>
          <strong>
            {/* todo: add loading skeleton here */}
            {signedVotes || '...'} of {requiredVotes || '...'} Sponsored Votes
          </strong>
        </h4>
        <p className={classes.subhead}>
          {requiredVotes && signedVotes >= requiredVotes ? (
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
            props.signatures.map(signature => {
              if (signature.canceled) return null;
              return (
                <Signature
                  key={signature.signer.id}
                  reason={signature.reason}
                  expirationTimestamp={signature.expirationTimestamp}
                  signer={signature.signer.id}
                  isAccountSigner={isAccountSigner}
                  sig={signature.sig}
                />
              );
            })}
          {/* TODO: check this against num of votes instead of num of sigs */}
          {props.signatures &&
            requiredVotes &&
            signedVotes < requiredVotes &&
            Array(requiredVotes - props.signatures.length)
              .fill('')
              .map((_s, i) => <li className={classes.placeholder}> </li>)}

          {props.isProposer && requiredVotes && signedVotes >= requiredVotes ? (
            <button className={classes.button} onClick={() => submitProposalOnChain()}>
              Submit on-chain
            </button>
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
              <SignatureForm id={props.id} />
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
