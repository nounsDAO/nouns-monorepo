export enum ExternalURL {
  twitter,
  nounsProtocol,
  discourse,
  document,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.twitter:
      return 'https://twitter.com/nounsdao';
    case ExternalURL.nounsProtocol:
      return 'https://nouns.notion.site/Explore-Nouns-a2a9dceeb1d54e10b9cbf3f931c2266f';
    case ExternalURL.discourse:
      return 'https://discourse.nouns.wtf/';
    case ExternalURL.document:
      return 'https://ubuyamadao.notion.site/DAO-bdab4020b66f404696c855e86c57bdec?pvs=4';
  }
};
