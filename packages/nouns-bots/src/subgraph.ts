import type { ProposalRecord, ProposalSource } from './types';

const PROPOSALS_QUERY = `
  query ProposalXBotProposals($first: Int!, $skip: Int!) {
    proposals(first: $first, skip: $skip, orderBy: createdBlock, orderDirection: desc) {
      id
      title
      createdBlock
      createdTransactionHash
    }
  }
`;

interface SubgraphProposal {
  id: string;
  title: string;
  createdBlock: string;
  createdTransactionHash: string;
}

interface SubgraphResponse {
  data?: { proposals?: SubgraphProposal[] };
  errors?: { message?: string }[];
}

export class NounsSubgraphProposalSource implements ProposalSource {
  constructor(
    private readonly endpoint: string,
    private readonly pageSize: number,
  ) {
    if (!Number.isSafeInteger(pageSize) || pageSize <= 0 || pageSize > 1_000) {
      throw new Error('pageSize must be an integer between 1 and 1000');
    }
  }

  async getLatestProposalId(): Promise<bigint | null> {
    const proposals = await this.fetchPage(this.pageSize, 0);
    if (proposals.length === 0) return null;
    return proposals.reduce(
      (latestId, proposal) => (proposal.id > latestId ? proposal.id : latestId),
      0n,
    );
  }

  async getProposalsAfter(proposalId: bigint): Promise<ProposalRecord[]> {
    const proposals: ProposalRecord[] = [];
    let skip = 0;

    while (true) {
      const page = await this.fetchPage(this.pageSize, skip);
      for (const proposal of page) {
        if (proposal.id > proposalId) proposals.push(proposal);
      }

      const reachedCursor = page.some(proposal => proposal.id <= proposalId);
      if (reachedCursor || page.length < this.pageSize) return proposals;
      skip += this.pageSize;
    }
  }

  private async fetchPage(first: number, skip: number): Promise<ProposalRecord[]> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: PROPOSALS_QUERY, variables: { first, skip } }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`Nouns subgraph request failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as SubgraphResponse;
    if (payload.errors?.length) {
      throw new Error(
        `Nouns subgraph returned errors: ${payload.errors
          .map(error => error.message ?? 'unknown error')
          .join('; ')}`,
      );
    }

    const proposals = payload.data?.proposals;
    if (!Array.isArray(proposals)) throw new Error('Nouns subgraph returned an invalid response');
    return proposals.map(proposal => ({
      id: BigInt(proposal.id),
      title: proposal.title,
      createdBlock: BigInt(proposal.createdBlock),
      transactionHash: proposal.createdTransactionHash,
    }));
  }
}
