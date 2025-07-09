import { fromNavigator } from '@lingui/detect-locale';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai/vanilla';
import { withAtomEffect } from 'jotai-effect';

import { DEFAULT_LOCALE, SupportedLocale } from '@/i18n/locales';
import { dynamicActivate } from '@/i18n/NounsI18nProvider';

export const activeLocaleAtom = withAtomEffect(
  atom(
    get => {
      const storeLocale = get(activeLocaleStorageAtom);
      return (storeLocale ?? fromNavigator() ?? DEFAULT_LOCALE) as SupportedLocale;
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
