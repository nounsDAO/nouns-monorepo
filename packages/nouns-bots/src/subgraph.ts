import { request, gql } from 'graphql-request';
import { config } from './config';
import { AuctionBids } from './types';

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
