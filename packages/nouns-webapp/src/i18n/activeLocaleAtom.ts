import { fromNavigator, multipleDetect } from '@lingui/detect-locale';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai/vanilla';
import { withAtomEffect } from 'jotai-effect';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/locales';
import { dynamicActivate } from '@/i18n/NounsI18nProvider';

export const pickSupportedLocale = (candidates: string[]): SupportedLocale => {
  const SUPPORTED_BASES = SUPPORTED_LOCALES.map(locale => locale.split('-')[0]);

  for (const candidate of candidates) {
    if ((SUPPORTED_LOCALES as unknown as string[]).includes(candidate))
      return candidate as SupportedLocale;

    // match on base language (e.g. "en-US" → "en")
    const base = candidate.split('-')[0];
    if (SUPPORTED_BASES.includes(base)) {
      const localeIndex = SUPPORTED_BASES.indexOf(base);
      return SUPPORTED_LOCALES[localeIndex];
    }
  }

  return DEFAULT_LOCALE;
};

export const activeLocaleAtom = withAtomEffect(
  atom(
    get => {
      const storeLocale = get(activeLocaleStorageAtom);
      return pickSupportedLocale(multipleDetect(storeLocale, fromNavigator(), DEFAULT_LOCALE));
    },
    (_get, set, locale: SupportedLocale) => set(activeLocaleStorageAtom, locale),
  ),
  get => {
    const activeLocale = get(activeLocaleAtom);
    if (activeLocale != undefined) dynamicActivate(activeLocale);
  },
);

const activeLocaleStorageAtom = atomWithStorage<string | undefined>(
  'lang',
  undefined,
  createJSONStorage(() => localStorage),
  {
    getOnInit: true,
  },
);
