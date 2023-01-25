import { JsonRpcSigner } from "@ethersproject/providers";
import { Trans } from '@lingui/macro';
import { useEthers } from "@usedapp/core";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { RouteComponentProps } from "react-router-dom";
import remarkBreaks from "remark-breaks";
import config, { CHAIN_ID } from "../../config";
import { useAppDispatch } from "../../hooks";
import Section from "../../layout/Section";
import { AlertModal, setAlertModal } from "../../state/slices/application";
import { useProposeBySigs } from "../../wrappers/nounsDao";
import { addSignature, DraftProposal, getDraftProposals, ProposalContent } from "../CreateDraftProposal/DraftProposalsStorage";

const domain = {
  name: 'Nouns DAO',
  chainId: CHAIN_ID,
  verifyingContract: config.addresses.nounsDAOProxy
};

const types = {
  Proposal: [
    { name: 'proposer', type: 'address' },
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'signatures', type: 'string[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
    { name: 'expiry', type: 'uint40' }
  ]
};

const DraftProposalPage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const proposalId = Number.parseInt(id);
  const { library, chainId } = useEthers();
  const signer = library?.getSigner();
  const [draftProposal, setDraftProposal] = useState<DraftProposal | undefined>(undefined);
  const [expiry, setExpiry] = useState(Math.round(Date.now() / 1000));

  useEffect(() => {
    const draftProposals = getDraftProposals();
    setDraftProposal(draftProposals[proposalId]);
  }, []);


  async function sign() {
    if (!draftProposal) return;

    const value = {
      ...draftProposal.proposalContent,
      'expiry': expiry
    };

    const signature = await signer!._signTypedData(domain, types, value);
    const updatedDraftProposal = addSignature(
      {
        signer: await signer!.getAddress(), 
        signature: signature!, 
        expiry: expiry}, 
      proposalId);
    setDraftProposal(updatedDraftProposal);
  }

  const [isProposePending, setProposePending] = useState(false);
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const { proposeBySigs, proposeBySigsState, events } = useProposeBySigs();

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

  async function proposeBySigsClicked() {
    await proposeBySigs(
      draftProposal?.signatures.map(s => [s.signature, s.signer, s.expiry]),
      draftProposal?.proposalContent.targets,
      draftProposal?.proposalContent.values,
      draftProposal?.proposalContent.signatures,
      draftProposal?.proposalContent.calldatas,
      draftProposal?.proposalContent.description,
    );
  }


  return (
    <Section fullWidth={false}>
      <h1>Draft Proposal {id}</h1>
      {draftProposal && (
        <ReactMarkdown
          children={draftProposal.proposalContent.description}
          remarkPlugins={[remarkBreaks]}
          />
      )}
      <pre>
        {JSON.stringify(draftProposal, null, 4)}
      </pre>
      <label>Expiry: <input type="text" value={expiry} onChange={e => setExpiry(Number.parseInt(e.target.value))} /></label>
      <Button onClick={() => sign()}>Sign proposal</Button>
      <Button onClick={() => proposeBySigsClicked()}>proposeBySigs</Button>
    </Section>
  )
}

export default DraftProposalPage;