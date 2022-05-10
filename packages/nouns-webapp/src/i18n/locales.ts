import en, { Locale as DaysJSLocale } from 'dayjs/locale/en';
import ja from 'dayjs/locale/ja';

export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  'en-US',
  'ja-JP',
];
export type SupportedLocale = typeof SUPPORTED_LOCALES[number] | 'pseudo';

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'en-US': 'English',
  'ja-JP': '日本語',
  pseudo: 'ƥƨèúδô',
};

export const LOCALE_DAYJS: {[locale in SupportedLocale]: DaysJSLocale} = {
  'en-US': en,
  'ja-JP': ja,
  pseudo: en,
};