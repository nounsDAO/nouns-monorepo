export const supportedLocales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '日本語',
    locale: 'ja',
  },
].concat(
  process.env.REACT_APP_INCLUDE_PSEUDOLOCALE  === "true" ? [{
    name: 'Pseduolocale',
    locale: 'pl',
  }] : []
);