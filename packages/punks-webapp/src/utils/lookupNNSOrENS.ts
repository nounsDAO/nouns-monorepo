import { Web3Provider } from '@ethersproject/providers';
import { BigNumber as EthersBN, utils } from 'ethers';

/**
 * Look up either NNS or ENS (using NNS contract to resovle NNS with ENS fallback)
 * @param library provider
 * @param address  Address to resolve
 * @returns  NNS or ENS or null (if neither resolve)
 */
export async function lookupNNSOrENS(
  library: Web3Provider,
  address: string,
): Promise<string | null> {
  try {
    // Call resolver contract
    const res = await library.call({
      to: '0x5982ce3554b18a5cf02169049e81ec43bfb73961', // see https://etherscan.io/address/0x5982cE3554B18a5CF02169049e81ec43BFB73961
      data: '0x55ea6c47000000000000000000000000' + address.substring(2), // call .resolve(address) method
    });
    // Parse result into a string.
    const offset = EthersBN.from(utils.hexDataSlice(res, 0, 32)).toNumber();
    const length = EthersBN.from(utils.hexDataSlice(res, offset, offset + 32)).toNumber();
    const data = utils.hexDataSlice(res, offset + 32, offset + 32 + length);
    return utils.toUtf8String(data) || null;
  } catch (e) {
    return null;
  }
}
