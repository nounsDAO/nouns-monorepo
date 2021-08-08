export enum ExternalURL {
  discord,
  twitter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/kDSTd39Ukz';
    case ExternalURL.twitter:
      return 'https://twitter.com/nounsdao';
  }
};
