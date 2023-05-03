import React, { useCallback, useEffect, useState } from 'react';
import classes from './CandidateSponsors.module.css';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import config, { CHAIN_ID } from '../../config';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useProposeBySigs, useUpdateProposalBySigs } from '../../wrappers/nounsDao';
import { useCandidateProposal, useAddSignature } from '../../wrappers/nounsData';

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

type Props = {
  id: string;
};

function SignatureForm(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState<number>();

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
    // if (!candidateProposal) return;
    let signature;
    if (proposalIdToUpdate) {
      const value = {
        proposer: candidateProposal.proposer,
        targets: candidateProposal.latestVersion.targets,
        values: candidateProposal.latestVersion.values,
        signatures: candidateProposal.latestVersion.signatures,
        calldatas: candidateProposal.latestVersion.calldatas,
        description: candidateProposal.latestVersion.description,
        expiry: expirationDate,
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
        expiry: expirationDate,
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
      expirationDate,
      candidateProposal.proposer,
      candidateProposal.slug,
      encodedProp,
    );

    await addSignature(
      signature,
      expirationDate,
      candidateProposal.proposer,
      candidateProposal.slug,
      encodedProp,
      reasonText,
    );
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

  return (
    <div className={classes.formWrapper}>
      {!candidateProposal ? (
        <h4 className={classes.formLabel}>Error loading candidate details</h4>
      ) : (
        <>
          <h4 className={classes.formLabel}>Sponsor this proposal candidate</h4>
          <textarea
            placeholder="Optional reason"
            value={reasonText}
            onChange={event => setReasonText(event.target.value)}
          />

          <h4 className={classes.formLabel}>Expiration date</h4>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]} // only future dates
            onChange={e => setExpirationDate(+dayjs(e.target.value))}
          />
          <button className={classes.button} onClick={() => sign()}>
            Sponsor
          </button>
        </>
      )}
    </div>
  );
}

export default SignatureForm;
