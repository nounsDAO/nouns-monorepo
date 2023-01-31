import { Web3Provider } from '@ethersproject/providers';
import { BigNumber as EthersBN, utils } from 'ethers';

/**
 * Look up either NNS or ENS (using NNS contract to resolve NNS with ENS fallback)
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
      to: '0x3e1970dc478991b49c4327973ea8a4862ef5a4de', // see https://etherscan.io/address/0x3e1970dc478991b49c4327973ea8a4862ef5a4de
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
