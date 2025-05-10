import { Hex, hexToString } from 'viem';
import { type PublicClient } from 'viem';

/**
 * Look up either NNS or ENS (using NNS contract to resolve NNS with ENS fallback)
 * @param client viem public client
 * @param address  Address to resolve
 * @returns  NNS or ENS or null (if neither resolve)
 */
export async function lookupNNSOrENS(
  client: PublicClient,
  address: string,
): Promise<string | null> {
  try {
    // Call resolver contract
    const res = await client.call({
      to: '0x849f92178950f6254db5d16d1ba265e70521ac1b', // see https://etherscan.io/address/0x849f92178950f6254db5d16d1ba265e70521ac1b
      data: `0x55ea6c47000000000000000000000000${address.substring(2)}`, // call .resolve(address) method
    });
    // Parse result into a string.
    const data = res.data || '0x';
    const offset = Number(BigInt('0x' + data.slice(2, 66)));
    const length = Number(BigInt('0x' + data.slice(2 + offset * 2, 2 + (offset + 32) * 2)));
    const resultData = '0x' + data.slice(2 + (offset + 32) * 2, 2 + (offset + 32 + length) * 2);
    return hexToString(<Hex>resultData) || null;
  } catch (e) {
    console.error('Error resolving NNS or ENS name:', e);
    return null;
  }
}
