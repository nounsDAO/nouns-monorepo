export enum ExternalURL {
  discord,
  twitter,
  notion,
  about,
  discourse,
  nounsbrCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'http://discord.gg/nounsbr';
    case ExternalURL.twitter:
      return 'https://twitter.com/nounsbr';
    case ExternalURL.notion:
      return 'https://nounsbr.notion.site/Explore-NounsBR-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.about:
       return 'https://nounsbr.com';
    case ExternalURL.discourse:
      return 'https://discourse.nounsbr.wtf/';
    case ExternalURL.nounsbrCenter:
      return 'https://nounsbr.center/';
  }
};
