import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';

/**
 * Given an ens return the address of the primary record
 * @param ens
 * @returns Primary address record for this ens if one exists
 */
export function useResolveENSToAddress(ens: string): string | null {
  const [address, setAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const { library } = useEthers();

  useEffect(() => {
    const resolveENS = async () => {
      const reverseENSResult = await library?.resolveName(ens);
      if (reverseENSResult) {
        setAddress(reverseENSResult);
      }
      setMounted(true);
    };

    if (!mounted && library) {
      resolveENS();
    }
  }, [address, ens, library, mounted]);

  return address;
}
