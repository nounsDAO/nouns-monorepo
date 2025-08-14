import { useAtomValue } from 'jotai/react';

import { activeLocaleAtom } from '@/i18n/active-locale-atom';

import { SupportedLocale } from '../i18n/locales';

export function useActiveLocale(): SupportedLocale {
  return useAtomValue(activeLocaleAtom);
}
