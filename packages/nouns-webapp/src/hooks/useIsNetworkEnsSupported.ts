// used to determine if the connectd network has ens support
import { useEthers } from '@usedapp/core';
import { useState } from 'react';

export const useIsNetworkEnsSupported = () => {
  const { library: provider } = useEthers();
  const [isEnsSupported, setIsEnsSupported] = useState<boolean>(false);
  const getNetwork = async () => {
    const network = provider?.getNetwork();
    const ensNetwork = (await network)?.ensAddress;
    if (ensNetwork) {
      setIsEnsSupported(true);
    } else {
      setIsEnsSupported(false);
    }
  };
  getNetwork();

  return isEnsSupported;
};
