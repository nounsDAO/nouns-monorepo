const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
};

const nonNegativeInteger = (name: string, fallback: number): number => {
  const raw = process.env[name] ?? fallback.toString();
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
};

const positiveInteger = (name: string, fallback: number): number => {
  const value = nonNegativeInteger(name, fallback);
  if (value === 0) throw new Error(`${name} must be greater than zero`);
  return value;
};

export interface BotConfig {
  subgraphUrl: string;
  subgraphPageSize: number;
  expectedXUsername: string;
  xCredentials: {
    appKey: string;
    appSecret: string;
    accessToken: string;
    accessSecret: string;
  };
}

export const isProposalXEnabled = (): boolean =>
  process.env.PROPOSAL_X_ENABLED?.trim().toLowerCase() === 'true';

export const loadConfig = (): BotConfig => {
  const subgraphUrl =
    process.env.NOUNS_SUBGRAPH_URL?.trim() || process.env.VITE_MAINNET_SUBGRAPH?.trim();
  if (!subgraphUrl) {
    throw new Error('Missing NOUNS_SUBGRAPH_URL or VITE_MAINNET_SUBGRAPH environment variable');
  }

  return {
    subgraphUrl,
    subgraphPageSize: positiveInteger('SUBGRAPH_PAGE_SIZE', 100),
    expectedXUsername: required('X_EXPECTED_USERNAME').replace(/^@/, ''),
    xCredentials: {
      appKey: required('X_API_KEY'),
      appSecret: required('X_API_SECRET'),
      accessToken: required('X_ACCESS_TOKEN'),
      accessSecret: required('X_ACCESS_TOKEN_SECRET'),
    },
  };
};
