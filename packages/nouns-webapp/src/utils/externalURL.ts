export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/keNWmpdQD7';
    case ExternalURL.twitter:
      return 'http://twitter.com/punkersdao';
    case ExternalURL.notion:
      return 'https://www.notion.so/CryptoPunks-DAO-Treasury-Docs-db000b97f1384807a27463ac496b24f6';
    case ExternalURL.discourse:
      return 'https://discourse.nouns.wtf/';
  }
};
