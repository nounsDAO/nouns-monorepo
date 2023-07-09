import { useEthers } from '@usedapp/core';
import snapshot from '@snapshot-labs/snapshot.js';

const SnapshotProposals = () => {
  const { account } = useEthers();
  const hub = 'https://hub.snapshot.org';
  const client = new snapshot.Client712(hub);

  return (
    <>

    </>
  );
};
export default SnapshotProposals;
