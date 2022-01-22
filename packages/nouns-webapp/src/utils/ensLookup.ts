import { useEffect, useState } from 'react';
import { useWeb3Context } from '../hooks/useWeb3';

export const useReverseENSLookUp = (address: string) => {
  const { provider } = useWeb3Context();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && provider) {
      provider
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

    return () => {
      setEns('');
      mounted = false;
    };
  }, [address, provider]);

  return ens;
};
