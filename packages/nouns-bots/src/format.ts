const MAX_TITLE_CODE_POINTS = 190;

const stripMarkdown = (value: string): string =>
  value
    .replace(/^#{1,6}\s+/, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const removeProposalPrefix = (value: string): string =>
  value.replace(/^(?:nouns dao\s+)?proposal\s+#?\d+\s*[:–—\-]\s*/i, '').trim();

const truncateTitle = (value: string): string => {
  const codePoints = Array.from(value);
  if (codePoints.length <= MAX_TITLE_CODE_POINTS) return value;
  return `${codePoints
    .slice(0, MAX_TITLE_CODE_POINTS - 1)
    .join('')
    .trimEnd()}…`;
};

export const normalizeProposalTitle = (subgraphTitle: string): string => {
  const title = removeProposalPrefix(stripMarkdown(subgraphTitle));
  return truncateTitle(title || 'Untitled proposal');
};

export interface ProposalPost {
  marker: string;
  text: string;
}

export const formatProposalPost = (proposalId: bigint, subgraphTitle: string): ProposalPost => {
  const marker = `Nouns DAO Proposal ${proposalId}:`;
  const title = normalizeProposalTitle(subgraphTitle);
  return {
    marker,
    text: `${marker} ${title}\n\nhttps://nouns.wtf/vote/${proposalId}`,
  };
};
