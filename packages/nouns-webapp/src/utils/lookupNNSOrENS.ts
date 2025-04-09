import { Web3Provider } from '@ethersproject/providers';
import { Contract, providers, utils } from 'ethers';
import { createNetworkHttpUrl } from '../config';

const NOUNS_CLD_ID = utils.namehash('nouns');

const resolver = new Contract(
  // https://basescan.org/address/0xF4Cc2b5F631998eBc7fA362aEE30141C5a10F519
  '0x78997D8ca4316421620A09f015512D779Dc34217',
  ['function reverseNameOf(address, uint256[], bool) view returns (string)'],
  new providers.JsonRpcProvider(createNetworkHttpUrl('base-mainnet')),
);

/**
 * Look up NNS and fallback to ENS
 * @param library provider
 * @param address  Address to resolve
 * @returns  NNS or ENS or null (if neither resolve)
 */
export async function lookupNNSOrENS(
  library: Web3Provider,
  address: string,
): Promise<string | null> {
  try {
    const name = await resolver.reverseNameOf(address, [NOUNS_CLD_ID], true);
    if (!name) {
      return library.lookupAddress(address);
    }
    return name;
  } catch (e) {
    return null;
  }
}
