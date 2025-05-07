import { useEffect, useState } from 'react';

import { usePublicClient } from 'wagmi';

/**
 * A function that takes a block number from the chain and returns the timestamp of when the block occurred.
 * @param blockNumber target block number to retrieve the timestamp for
 * @returns unix timestamp of block number
 */
export function useBlockTimestamp(blockNumber: number | undefined): number | undefined {
  const publicClient = usePublicClient();
  const [blockTimestamp, setBlockTimestamp] = useState<number | undefined>();

  useEffect(() => {
    async function updateBlockTimestamp() {
      if (!blockNumber) return;
      try {
        const block = await publicClient.getBlock({
          blockNumber: BigInt(blockNumber),
        });
        setBlockTimestamp(Number(block.timestamp) || undefined);
      } catch (error) {
        console.error('Error fetching block timestamp:', error);
        setBlockTimestamp(undefined);
      }
    }

    updateBlockTimestamp();
  }, [blockNumber, publicClient]);

  return blockTimestamp;
}
