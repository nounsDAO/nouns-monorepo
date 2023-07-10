export enum ExternalURL {
  twitter,
  charmverse,
  discourse,
  nounsCenter,
  instagram,
  linkedin,
  jobPortal,
  discord,
  github,
  telegram
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/fCG8B9vN7z';
    case ExternalURL.twitter:
      return 'https://twitter.com/atxdao';
    case ExternalURL.charmverse:
      return 'https://app.charmverse.io/join?domain=atx-dao';
    case ExternalURL.discourse:
      return 'https://atxdao.freeflarum.com/';
    case ExternalURL.nounsCenter:
      return 'https://nouns.center/';
    case ExternalURL.instagram:
      return 'https://www.instagram.com/atx.dao/';
    case ExternalURL.linkedin:
      return 'https://www.linkedin.com/company/atxdao/mycompany/';
    case ExternalURL.jobPortal:
      return 'https://atxdao.pallet.com/talent/welcome';
    case ExternalURL.github:
      return 'https://github.com/ATXDAO';
    case ExternalURL.telegram:
      return 'https://t.me/+7NTAE2d5fLJlYWE5';
  }
};
