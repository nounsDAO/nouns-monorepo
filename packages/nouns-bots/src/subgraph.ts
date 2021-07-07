import { request, gql } from 'graphql-request';
import { config } from './config';
import { Auction } from './types';

/**
 * Query the subgraph and return the last auction id created.
 * @returns The last auction id from the subgraph.
 */
export async function getLastAuctionId(): Promise<number> {
  const res = await request<{ auctions: Auction[] }>(
    config.nounsSubgraph,
    gql`
      query {
        auctions(first: 1 orderBy: nounId orderDirection: desc) {
          id
        }
      }
    `,
  );
  return Number(res.auctions[0].id);
}
