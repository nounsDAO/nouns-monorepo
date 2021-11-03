export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
  github
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'http://discord.gg/nouns';
    case ExternalURL.twitter:
      return 'https://twitter.com/diatomdao';
    case ExternalURL.notion:
      return 'https://nouns.notion.site/Explore-Nouns-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.discourse:
      return 'https://discourse.nouns.wtf/';
    case ExternalURL.github:
      return 'https://github.com/Dollar-Donation-Club/diatom-monorepo';
  }
};
