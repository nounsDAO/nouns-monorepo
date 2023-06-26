import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ogpunksByOwner } from '../subgraph';
import { lowerCaseAddress } from '../../utils/addressAndENSDisplayUtils';
import { useEthers } from '@usedapp/core';

export interface OgPunk {
  id: string;
  delegate: {
    id: string;
  };
}

export const useOgPunks = () => {
  const { account } = useEthers();
  const [ogPunks, setOgPunks] = useState<OgPunk[]>([]);

  const { loading, error, data, refetch } = useQuery(
    ogpunksByOwner(lowerCaseAddress(account ?? '')),
    {
      skip: !account,
    },
  );

  useEffect(() => {
    !loading && !error && setOgPunks(data?.ogpunks);
  }, [loading, error, data]);

  return {
    ogPunks,
    refetch,
  };
};
