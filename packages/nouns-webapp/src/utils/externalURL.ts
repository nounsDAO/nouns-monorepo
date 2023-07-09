export enum ExternalURL {
  twitter,
  charmverse,
  discourse,
  nounsCenter,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/atxdao';
    case ExternalURL.charmverse:
      return 'https://app.charmverse.io/join?domain=atx-dao';
    case ExternalURL.discourse:
      return 'https://atxdao.freeflarum.com/';
    case ExternalURL.nounsCenter:
      return 'https://nouns.center/';
      
  }
};
