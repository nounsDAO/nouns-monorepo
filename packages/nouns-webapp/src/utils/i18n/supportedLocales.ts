import {
  en,
  ja,
} from 'make-plural/plurals';

export interface SupportedLocale {
  name: string;
  locale: string;
  plurals: (n: number | string, ord?:boolean | undefined) => "other";
}

export const supportedLocales = [
  {
    name: 'English',
    locale: 'en',
    plurals: en
  },
  {
    name: '日本語',
    locale: 'ja',
    plurals: ja
  },
].concat(
  process.env.REACT_APP_INCLUDE_PSEUDOLOCALE  === "true" ? [{
    name: 'Pseduolocale',
    locale: 'pl',
    plurals: en
  }] : []
);