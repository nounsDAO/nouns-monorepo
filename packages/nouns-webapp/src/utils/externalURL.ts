export enum ExternalURL {
  docs,
  discord,
  twitter,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.docs:
      return 'https://docs.publicnouns.wtf';
    case ExternalURL.discord:
      return 'https://discord.gg/DJ8BHRWh';
    case ExternalURL.twitter:
      return 'https://twitter.com/PublicNouns';
    case ExternalURL.discourse:
      return 'http://pnouns.discourse.group/';
  }
};
