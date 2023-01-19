export enum ExternalURL {
  twitter,
  notion,
  discourse,
  n00unsCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/n00unsdao';
    case ExternalURL.notion:
      return 'https://n00uns.notion.site/Explore-N00uns-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.discourse:
      return 'https://discourse.n00uns.wtf/';
    case ExternalURL.n00unsCenter:
      return 'https://n00uns.center/';
  }
};
