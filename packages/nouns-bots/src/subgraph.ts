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
        auctions(orderBy: startTime, orderDirection: desc, first: 1) {
          id
        }
      }
    `,
  );
  return Number(res.auctions[0].id);
}
