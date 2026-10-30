import { runProposalXBot } from '../runtime';

export default async (): Promise<void> => {
  await runProposalXBot();
};

export const config = {
  schedule: '*/5 * * * *',
};
