import React, { useCallback, useEffect, useState } from 'react';
import classes from './CandidateSponsors.module.css';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import config, { CHAIN_ID } from '../../config';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useProposeBySigs, useUpdateProposalBySigs } from '../../wrappers/nounsData';
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
  transactionState: 'None' | 'Success' | 'Mining' | 'Fail' | 'Exception';
  setTransactionState: Function;
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
  const [isAddSignaturePending, setIsAddSignaturePending] = useState(false);
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
    if (proposalIdToUpdate && candidateProposal) {
      const value = {
        proposer: candidateProposal.proposer,
        targets: candidateProposal.version.targets,
        values: candidateProposal.version.values,
        signatures: candidateProposal.version.signatures,
        calldatas: candidateProposal.version.calldatas,
        description: candidateProposal.version.description,
        expiry: expirationDate,
        proposalId: proposalIdToUpdate,
      };
      signature = await signer!._signTypedData(domain, updateProposalTypes, value);
    } else {
      if (!candidateProposal) return;
      const value = {
        proposer: candidateProposal.proposer,
        targets: candidateProposal.version.targets,
        values: candidateProposal.version.values,
        signatures: candidateProposal.version.signatures,
        calldatas: candidateProposal.version.calldatas,
        description: candidateProposal.version.description,
        expiry: expirationDate,
      };
      signature = await signer!._signTypedData(domain, createProposalTypes, value);
    }

    const encodedProp = await calcProposalEncodeData(
      candidateProposal.proposer,
      candidateProposal.version.targets,
      candidateProposal.version.values,
      candidateProposal.version.signatures,
      candidateProposal.version.calldatas,
      candidateProposal.version.description,
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

  const [submitSignatureStatusMessage, setSubmitSignatureStatusMessage] = React.useState<{
    title: string;
    message: string;
    show: boolean;
  }>();

  useEffect(() => {
    switch (addSignatureState.status) {
      case 'None':
        setIsAddSignaturePending(false);
        break;
      case 'Mining':
        setIsAddSignaturePending(true);
        break;
      case 'Success':
        setSubmitSignatureStatusMessage({
          title: 'Success',
          message: 'Signature added',
          show: true,
        });
        setIsAddSignaturePending(false);
        break;
      case 'Fail':
        setSubmitSignatureStatusMessage({
          title: 'Transaction Failed',
          message: proposeBySigsState?.errorMessage || 'Please try again.',
          show: true,
        });
        setIsAddSignaturePending(false);
        break;
      case 'Exception':
        setSubmitSignatureStatusMessage({
          title: 'Error',
          message: proposeBySigsState?.errorMessage || 'Please try again.',
          show: true,
        });
        setIsAddSignaturePending(false);
        break;
    }
  }, [addSignatureState, setSubmitSignatureStatusMessage]);

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

          <h4 className={classes.formLabel}>Expiration date (required)</h4>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]} // only future dates
            onChange={e => setExpirationDate(+dayjs(e.target.value))}
          />
          <div className="text-center">
            {isAddSignaturePending ? (
              <img src="/loading-noggles.svg" alt="loading" className={classes.loadingNoggles} />
            ) : (
              <button
                className={classes.button}
                onClick={() => {
                  sign();
                  // not using pending status while waiting for user to sign the first signature because rejected signatures are not caught
                }}
                disabled={props.transactionState === 'Mining' || expirationDate === undefined}
              >
                Sponsor
              </button>
            )}
          </div>

          {submitSignatureStatusMessage?.show && (
            <div className={classes.submitSignatureStatusOverlay}>
              {/* {(addSignatureState.status === "Exception" || addSignatureState.status === "Fail") && (
                <button className={classes.closeButton} onClick={() => {
                  setSubmitSignatureStatusMessage(undefined);
                  setIsAddSignaturePending(false);
                }}>
                  &times;
                </button>
              )} */}
              <div>
                <Trans>{submitSignatureStatusMessage.title}</Trans>
              </div>
              {submitSignatureStatusMessage.title === 'Success' ? (
                <div>
                  <Trans>{submitSignatureStatusMessage.message}</Trans>
                </div>
              ) : (
                <button
                  className={classes.closeLink}
                  onClick={() => {
                    setSubmitSignatureStatusMessage(undefined);
                    setIsAddSignaturePending(false);
                  }}
                >
                  <Trans>{submitSignatureStatusMessage.message}</Trans>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SignatureForm;
