import { useEthers } from '@usedapp/core';
import { Web3Provider } from '@ethersproject/providers'
import { useEffect, useState } from 'react';
import { cache, cacheKey, CHAIN_ID } from '../config';
import { BigNumber, utils } from 'ethers';

export const ensCacheKey = (address: string) => {
  return cacheKey(cache.ens, CHAIN_ID, address);
};

export const useReverseENSLookUp = (address: string) => {
  const { library } = useEthers();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && library) {
      // Look for resolved ENS in local storage (result of pre-fetching)
      const maybeCachedENSResultRaw = localStorage.getItem(ensCacheKey(address));
      if (maybeCachedENSResultRaw) {
        const maybeCachedENSResult = JSON.parse(maybeCachedENSResultRaw);
        if (parseInt(maybeCachedENSResult.expires) > Date.now() / 1000) {
          setEns(maybeCachedENSResult.name);
        } else {
          localStorage.removeItem(ensCacheKey(address));
        }
      }

      // If address not in local storage, attempt to resolve via RPC call.
      // At this stage if the item is in local storage we know it isn't expired.
      if (!localStorage.getItem(ensCacheKey(address))) {
        lookupAddress(library, address)
          .then(name => {
            if (!name) return;
            if (mounted) {
              localStorage.setItem(
                ensCacheKey(address),
                JSON.stringify({
                  name,
                  expires: Date.now() / 1000 + 30 * 60,
                }),
              );
              setEns(name);
            }
          })
          .catch(error => {
            console.log(`error resolving reverse ens lookup: `, error);
          });
      }
    }

    return () => {
      setEns('');
      mounted = false;
    };
  }, [address, library]);

  return ens;
};

/**
 * Look up either NNS or ENS (using NNS contract to resovle NNS with ENS fallback)
 * @param library provider 
 * @param address  Address to resolve
 * @returns  NNS or ENS or null (if neither resolve)
 */
export async function lookupAddress(library: Web3Provider, address: string): Promise<string | null> {
  try {
    // Call resolver contract
    const res = await library.call({
      to: '0x5982ce3554b18a5cf02169049e81ec43bfb73961', // see https://etherscan.io/address/0x5982cE3554B18a5CF02169049e81ec43BFB73961
      data: '0x55ea6c47000000000000000000000000' + address.substring(2), // call .resolve(address) method
    });
    // Parse result into a string.
    const offset = BigNumber.from(utils.hexDataSlice(res, 0, 32)).toNumber();
    const length = BigNumber.from(utils.hexDataSlice(res, offset, offset + 32)).toNumber();
    const data = utils.hexDataSlice(res, offset + 32, offset + 32 + length);
    return utils.toUtf8String(data) || null;
  } catch (e) {
    return null;
  }
}