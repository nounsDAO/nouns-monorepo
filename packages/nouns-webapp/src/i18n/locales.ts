import en, { Locale as DaysJSLocale } from 'dayjs/locale/en';
import ja from 'dayjs/locale/ja';
import zh from 'dayjs/locale/zh-cn';

export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  'en-US',
  'zh-CN',
  'ja-JP',
] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number] | 'pseudo';

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'en-US': 'English',
  'zh-CN': '中文',
  'ja-JP': '日本語',
  pseudo: 'ƥƨèúδô',
};

export enum Locales {
  en_US = 'en-US',
  zh_CN = 'zh-CN',
  ja_JP = 'ja-JP',
}

// Map SupportedLocale string to DaysJS locale object (used for locale aware time formatting)
export const SUPPORTED_LOCALE_TO_DAYSJS_LOCALE: { [locale in SupportedLocale]: DaysJSLocale } = {
  'en-US': en,
  'zh-CN': zh,
  'ja-JP': ja,
  pseudo: en,
};
