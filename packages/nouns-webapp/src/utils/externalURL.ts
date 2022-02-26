export enum ExternalURL {
  discord,
  twitter,
  // notion,
  // discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/YTWzkcarXr';
    case ExternalURL.twitter:
      return 'https://twitter.com/ChiliagonDAO';
   
  }
};
 
// case ExternalURL.notion:
// return 'https://nouns.notion.site/Explore-Nouns-a2a9dceeb1d54e10b9cbf3f931c2266f';
//     case ExternalURL.discourse:
// return 'https://discourse.nouns.wtf/';