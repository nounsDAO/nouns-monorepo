/**
 * useActiveLocale.ts is a modified version of https://github.com/Uniswap/interface/blob/main/src/hooks/useActiveLocale.ts
 */
import { fromNavigator } from '@lingui/detect-locale';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from '../i18n/locales';

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
function parseLocale(maybeSupportedLocale: unknown): SupportedLocale | undefined {
  if (typeof maybeSupportedLocale !== 'string') return undefined;
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale: string) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale,
  );
}

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale(): SupportedLocale | undefined {
  if (!navigator.language) return undefined;

  const [language, region] = navigator.language.split('-');

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language);
  }

  return parseLocale(language);
}

function storeLocale(): SupportedLocale | undefined {
  return localStorage.getItem('lang') ?? undefined;
}

export const initialLocale = parseLocale(storeLocale()) ?? navigatorLocale() ?? DEFAULT_LOCALE;

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): SupportedLocale {
  return storeLocale() ?? navigatorLocale() ?? fromNavigator() ?? DEFAULT_LOCALE;
}
