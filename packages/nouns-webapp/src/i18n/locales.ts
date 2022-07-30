import en, { Locale as DaysJSLocale } from 'dayjs/locale/en';
import ja from 'dayjs/locale/ja';
import pt from 'dayjs/locale/pt-br';

export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  'en-US',
  'ja-JP',
  'pt-BR',
];
export type SupportedLocale = typeof SUPPORTED_LOCALES[number] | 'pseudo';

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'en-US': 'English',
  'ja-JP': '日本語',
  'pt-BR': 'Português',
  pseudo: 'ƥƨèúδô',
};

export enum Locales {
  en_US = 'en-US',
  ja_JP = 'ja-JP',
  pt_BR = 'pt-BR',
}

// Map SupportedLocale string to DaysJS locale object (used for locale aware time formatting)
export const SUPPORTED_LOCALE_TO_DAYSJS_LOCALE: { [locale in SupportedLocale]: DaysJSLocale } = {
  'en-US': en,
  'ja-JP': ja,
  'pt-BR': pt,
  pseudo: en,
};
