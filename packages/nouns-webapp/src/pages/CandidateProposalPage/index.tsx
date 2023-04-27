import { JsonRpcSigner } from '@ethersproject/providers';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import { useCallback, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import config, { CHAIN_ID } from '../../config';
import { useAppDispatch } from '../../hooks';
import Section from '../../layout/Section';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useProposeBySigs, useUpdateProposalBySigs } from '../../wrappers/nounsDao';
import {
  addSignature,
  DraftProposal,
  getDraftProposals,
  ProposalContent,
} from '../CreateDraftProposal/DraftProposalsStorage';
import { useAddSignature, useCandidateProposal } from '../../wrappers/nounsData';
import { ethers } from 'ethers';

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

const CandidateProposalPage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const { library, chainId } = useEthers();
  const signer = library?.getSigner();

  const [expiry, setExpiry] = useState(Math.round(Date.now() / 1000) + 60 * 60 * 24);
  const [proposalIdToUpdate, setProposalIdToUpdate] = useState('');

  const candidateProposal = useCandidateProposal(id);
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

  async function proposeBySigsClicked() {
    await proposeBySigs(
      candidateProposal?.latestVersion.versionSignatures.map((s: any) => [
        s.sig,
        s.signer.id,
        s.expirationTimestamp,
      ]),
      candidateProposal?.latestVersion.targets,
      candidateProposal?.latestVersion.values,
      candidateProposal?.latestVersion.signatures,
      candidateProposal?.latestVersion.calldatas,
      candidateProposal?.latestVersion.description,
    );
  }
  async function updateProposalBySigsClicked() {
    //   const proposalId = Number.parseInt(proposalIdToUpdate);
    //   await updateProposalBySigs(
    //     proposalId,
    //     draftProposal?.signatures.map(s => [s.signature, s.signer, s.expiry]),
    //     draftProposal?.proposalContent.targets,
    //     draftProposal?.proposalContent.values,
    //     draftProposal?.proposalContent.signatures,
    //     draftProposal?.proposalContent.calldatas,
    //     draftProposal?.proposalContent.description,
    //   )
  }

  console.log('>> addSignatureState', addSignatureState);

  return (
    <Section fullWidth={false}>
      <h1>Candidate Proposal {id}</h1>
      {candidateProposal && (
        <ReactMarkdown children={candidateProposal.description} remarkPlugins={[remarkBreaks]} />
      )}
      <pre>{JSON.stringify(candidateProposal, null, 4)}</pre>

      <label>
        Expiry:{' '}
        <input
          type="text"
          value={expiry}
          onChange={e => setExpiry(Number.parseInt(e.target.value))}
        />
      </label>
      <label>
        Update proposal id (leave empty if creating a new proposal):
        <input
          type="text"
          value={proposalIdToUpdate}
          onChange={e => setProposalIdToUpdate(e.target.value)}
        />
      </label>

      <Button onClick={() => sign()} style={{ marginBottom: 10 }}>
        Sign proposal (status: {addSignatureState.status})
      </Button>
      <Button onClick={() => proposeBySigsClicked()} style={{ marginBottom: 10 }}>
        proposeBySigs
      </Button>

      <Container>
        <Button onClick={() => updateProposalBySigsClicked()} style={{ display: 'inline' }}>
          updateProposalBySig
        </Button>
      </Container>
    </Section>
  );
};

export default CandidateProposalPage;
