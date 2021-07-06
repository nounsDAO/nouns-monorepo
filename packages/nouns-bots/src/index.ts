import dotenv from 'dotenv';
import { config } from './config';
import { request, gql } from 'graphql-request';
import { Auction } from './types';

dotenv.config();

console.log('hello world', config.nounsSubgraph);

const AUCTIONS_QUERY = gql`
  query GetAuctions {
    auctions {
      id
    }
  }
`;

const getAuctions = async () => {
  const res = await request<{ auctions: Auction[] }>(config.nounsSubgraph, AUCTIONS_QUERY);
  console.log('res', res);
}

getAuctions().then(
  () => 'Auctions observer started',
);
