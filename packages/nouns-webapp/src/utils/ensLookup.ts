import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';

export const useReverseENSLookUp = (address: string) => {
  const { library } = useEthers();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && library) {
      const maybeCachedENSResultRaw = localStorage.getItem(address);
      if (maybeCachedENSResultRaw) {
        const maybeCachedENSResult =  JSON.parse(maybeCachedENSResultRaw);
        if (parseInt(maybeCachedENSResult.expires) > Date.now()/1000) {
            //  return maybeCachedENSResult.resolution;
            setEns(maybeCachedENSResult.name);
        } else {
          localStorage.removeItem(address);
        }
      } else {
        console.log("CACHE MISS");
        library
          .lookupAddress(address)
          .then(name => {
            if (!name) return;
            if (mounted) {
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
