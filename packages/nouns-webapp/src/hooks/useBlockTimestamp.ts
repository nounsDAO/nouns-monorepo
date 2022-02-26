import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';

export function useBlockTimestamp(blockno: number | undefined): number | undefined {
  const { library } = useEthers();
  const [blockTimestamp, setBlockTimestamp] = useState<number | undefined>();

  async function updateBlockTimestamp() {
    if (!blockno) return;
    const blockData = await library?.getBlock(blockno);
    setBlockTimestamp(blockData?.timestamp || undefined);
  }

  useEffect(() => {
    updateBlockTimestamp();
  }, []);

  return blockTimestamp;
}
