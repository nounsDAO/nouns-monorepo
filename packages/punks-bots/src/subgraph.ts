import { request, gql } from 'graphql-request';
import { config } from './config';
import { AuctionBids, Proposal, ProposalSubgraphResponse } from './types';
import { parseProposalSubgraphResponse } from './utils/proposals';

/**
 * Query the subgraph and return the last auction id and bid created.
 * @returns The last auction id and bid from the subgraph.
 */
export async function getLastAuctionBids(): Promise<AuctionBids> {
  const res = await request<{ auctions: AuctionBids[] }>(
    config.nounsSubgraph,
    gql`
      query {
        auctions(orderBy: startTime, orderDirection: desc, first: 1) {
          id
          endTime
          bids(orderBy: blockNumber, orderDirection: desc, first: 1) {
            id
            amount
            bidder {
              id
            }
          }
        }
      }
    `,
  );
  return res.auctions[0];
}

/**
 * Query the subgraph and return all proposals and votes
 * @returns All proposals and votes from the subgraph
 */
export async function getAllProposals(): Promise<Proposal[]> {
  const res = await request<ProposalSubgraphResponse>(
    config.nounsSubgraph,
    gql`
      {
        proposals {
          id
          proposer {
            id
          }
          description
          status
          quorumVotes
          proposalThreshold
          startBlock
          endBlock
          executionETA
          votes {
            id
            voter {
              id
            }
            votes
            supportDetailed
            reason
          }
        }
      }
    `,
  );
  return parseProposalSubgraphResponse(res);
}
