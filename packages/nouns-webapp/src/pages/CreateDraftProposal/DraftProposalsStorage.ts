
const STORAGE_KEY = 'draft-proposals';

export interface DraftProposal {
  proposalContent: ProposalContent;
  signatures: ProposalSignaure[];
}

export interface ProposalSignaure {
  signer: string;
  signature: string;
  expiry: number;
}

export interface ProposalContent {
  proposer: string;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  description: string;
}

export const saveDraftProposal = (draftProposal: DraftProposal) => {
  const draftProposals = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  draftProposals.push(draftProposal);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftProposals));
}

export const getDraftProposals = () : DraftProposal[] => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
}

export const addSignature = (signature: ProposalSignaure, proposalId: number) : DraftProposal => {
  const draftProposals = getDraftProposals();
  const draftProposal = draftProposals[proposalId];
  const signatures = draftProposal['signatures'];
  signatures.push(signature);
  draftProposals[proposalId] = draftProposal;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftProposals));

  return draftProposal;
}