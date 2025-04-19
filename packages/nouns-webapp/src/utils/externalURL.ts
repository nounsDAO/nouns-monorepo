export enum ExternalURL {
  twitter,
  notion,
  farcaster,
  nounsCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/nounsdao';
    case ExternalURL.notion:
      return 'https://nouns.notion.site/Explore-Nouns-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.farcaster:
      return 'https://warpcast.com/~/channel/nouns/';
    case ExternalURL.nounsCenter:
      return 'https://nouns.center/';
  }
};
