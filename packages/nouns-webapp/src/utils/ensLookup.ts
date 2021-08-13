import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';

export const useReverseENSLookUp = (address: string) => {
  const { library } = useEthers();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && library) {
      library
        .lookupAddress(address)
        .then(name => {
          if (mounted) {
            setEns(name);
          }
        })
        .catch(error => {
          console.log(`error resolving reverse ens lookup: `, error);
        });
    }

    return () => {
      setEns('');
      mounted = false;
    };
  }, [address, library]);

  return ens;
};
