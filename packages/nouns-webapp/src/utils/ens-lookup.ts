import { useEffect, useState } from 'react';

import { usePublicClient } from 'wagmi';

import { cache, cacheKey, CHAIN_ID } from '@/config';

import { Address } from '@/utils/types';
import { lookupNNSOrENS } from './lookup-nns-or-ens';

export const ensCacheKey = (address: string) => {
  return cacheKey(cache.ens, CHAIN_ID, address);
};

export const useReverseENSLookUp = (address: Address) => {
  const publicClient = usePublicClient();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && publicClient) {
      // Look for resolved ENS in local storage (result of pre-fetching)
      const maybeCachedENSResultRaw = localStorage.getItem(ensCacheKey(address));
      if (maybeCachedENSResultRaw) {
        const maybeCachedENSResult = JSON.parse(maybeCachedENSResultRaw);
        if (Number(maybeCachedENSResult.expires) > Date.now() / 1000) {
          setEns(maybeCachedENSResult.name);
        } else {
          localStorage.removeItem(ensCacheKey(address));
        }
      }

      // If address not in local storage, attempt to resolve via RPC call.
      // At this stage if the item is in local storage we know it isn't expired.
      if (!localStorage.getItem(ensCacheKey(address))) {
        lookupNNSOrENS(publicClient, address)
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
  }, [address, publicClient]);

  return ens;
};
