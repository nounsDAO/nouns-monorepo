export enum ExternalURL {
  discord,
  twitter,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/DJ8BHRWh';
    case ExternalURL.twitter:
      return 'https://twitter.com/publicnouns';
    case ExternalURL.discourse:
      return 'http://pnouns.discourse.group/';
  }
};
