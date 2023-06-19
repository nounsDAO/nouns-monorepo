export enum ExternalURL {
  twitter,
  notion,
  discourse,
  vrbsCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/vrbsdao';
    case ExternalURL.notion:
      return 'https://vrbs.notion.site/Explore-Vrbs-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.discourse:
      return 'https://discourse.vrbs.wtf/';
    case ExternalURL.vrbsCenter:
      return 'https://vrbs.center/';
  }
};
