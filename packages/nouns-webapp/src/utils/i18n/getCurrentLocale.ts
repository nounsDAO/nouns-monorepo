import { detect, fromNavigator, fromStorage } from '@lingui/detect-locale';

/**
 * Gets current locale
 *
 * This function uses a three step process to determine which locale to use (incrementally falling back):
 * 1. Look for lang variable in local storage, using that if it exists
 * 2. Getting locale from browser
 * 3. Falling back to en if 1 and 2 fail
 *
 * @returns locale
 */
export const getCurrentLocale = () => {
  const DEFAULT_FALLBACK = () => 'en';
  return detect(fromStorage('lang'), fromNavigator(), DEFAULT_FALLBACK) || 'en';
};
