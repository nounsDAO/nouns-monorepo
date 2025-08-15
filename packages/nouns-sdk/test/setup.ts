import FetchAdapter from '@pollyjs/adapter-fetch';
import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';

// Register Polly adapters
Polly.register(FetchAdapter);
Polly.register(FSPersister);

function normalizeRpcUrl(url: string): string {
  return url
    .replace(process.env.MAINNET_RPC_URL ?? 'https://eth.merkle.io', 'https://mainnet.rpc.local')
    .replace(
      process.env.SEPOLIA_RPC_URL ?? 'https://sepolia.drpc.org',
      'https://sepolia.rpc.local',
    );
}

export function setupPolly(testName: string) {
  const polly = new Polly(testName, {
    adapters: ['fetch'],
    persister: 'fs',
    mode: 'replay',
    recordIfMissing: !process.env.CI,
    recordFailedRequests: false,
    logLevel: 'WARN',
    persisterOptions: {
      fs: {
        recordingsDir: './test/__recordings__',
      },
    },
    matchRequestsBy: {
      method: true,
      url: (url: string) => normalizeRpcUrl(url),
      headers: false,
      body: true,
      order: false,
    },
  });

  polly.server.any().on('beforePersist', (_req, recording) => {
    recording.request.url = normalizeRpcUrl(recording.request.url);
    console.log('Recording HTTP request:', recording.request.url);
  });

  return polly;
}
