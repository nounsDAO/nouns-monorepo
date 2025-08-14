import { parseAbiItem, PublicClient } from 'viem';

import { Address } from '@/utils/types';

/**
 * look up NNS or ENS (NNS first, ENS fallback)
 * @param client
 * @param target wallet address
 * @returns name or null
 */
export async function lookupNNSOrENS(
  client: PublicClient,
  target: Address,
): Promise<string | null> {
  // try NNS
  try {
    const name = await client.readContract({
      address: '0x3e1970dc478991b49c4327973ea8a4862ef5a4de',
      abi: [parseAbiItem('function resolve(address) view returns (string)')],
      functionName: 'resolve',
      args: [target],
    });
    if (name) return name;
  } catch {
    // no biggie, NNS miss
  }

  // fallback ENS
  try {
    const name = await client.readContract({
      address: '0x849f92178950f6254db5d16d1ba265e70521ac1b',
      abi: [parseAbiItem('function resolve(address) view returns (string)')],
      functionName: 'resolve',
      args: [target],
    });
    return name || null;
  } catch {
    return null;
  }
}
