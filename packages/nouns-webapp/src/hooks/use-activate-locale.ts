import { useAtomValue } from 'jotai/react';

import { activeLocaleAtom } from '@/i18n/activeLocaleAtom';

import { SupportedLocale } from '../i18n/locales';

export function useActiveLocale(): SupportedLocale {
  return useAtomValue(activeLocaleAtom);
}
