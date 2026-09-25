import { ProposalXBot } from './bot';
import { isProposalXEnabled, loadConfig } from './config';
import { NetlifyBlobStateStore } from './netlify-blobs';
import { NounsSubgraphProposalSource } from './subgraph';
import { XPostPublisher } from './x';

// The scheduled function runs every five minutes. A shorter lease prevents overlapping
// manual invocations without delaying the next scheduled retry after a failed invocation.
const LOCK_TTL_MS = 4 * 60 * 1000;

export const runProposalXBot = async (): Promise<'completed' | 'disabled' | 'locked'> => {
  if (!isProposalXEnabled()) {
    console.info('Proposal X bot is disabled');
    return 'disabled';
  }

  const config = loadConfig();
  const store = new NetlifyBlobStateStore();
  const lockToken = await store.acquireLock(LOCK_TTL_MS);
  if (lockToken === null) {
    console.warn('Another proposal X bot invocation currently holds the Netlify Blobs lease');
    return 'locked';
  }

  const bot = new ProposalXBot(
    new NounsSubgraphProposalSource(config.subgraphUrl, config.subgraphPageSize),
    store,
    new XPostPublisher(config.xCredentials, config.expectedXUsername),
    {},
  );
  await bot.tick();
  return 'completed';
};
