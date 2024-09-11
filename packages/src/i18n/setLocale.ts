import { dynamicActivate } from './NounsI18nProvider';

/**
 * Sets locale in local storage
 *
 * Note: this value will persist across sessions
 *
 * @param locale Locale we wish to use for this user
 */
export const setLocale = (locale: string) => {
  if (localStorage.getItem('lang') !== locale) {
    localStorage.setItem('lang', locale);
    dynamicActivate(locale);
  }
};
