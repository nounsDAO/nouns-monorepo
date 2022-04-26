import {
  en,
  ja,
} from 'make-plural/plurals';

export interface SupportedLocale {
  name: string;
  locale: string;
};
import { PluralCategory } from 'make-plural/plurals'

type LocalePlural = {
  [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory
}

export const plurals: LocalePlural = {
  'en': en,
  'ja': ja,
  pseduo: en
};

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