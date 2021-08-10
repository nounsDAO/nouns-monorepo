export enum ExternalURL {
  discord,
  twitter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'http://discord.gg/nouns';
    case ExternalURL.twitter:
      return 'https://twitter.com/nounsdao';
  }
};
