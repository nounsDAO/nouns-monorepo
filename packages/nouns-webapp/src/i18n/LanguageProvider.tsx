/**
 * LanguageProvider.tsx is a modified version of https://github.com/Uniswap/interface/blob/main/src/lib/i18n.tsx
 */
import { ReactNode, useCallback } from 'react';

import { initialLocale, useActiveLocale } from '../hooks/useActivateLocale';

import { SupportedLocale } from './locales';
import { dynamicActivate, NounsI18nProvider } from './NounsI18nProvider';

dynamicActivate(initialLocale);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale();

  const onActivate = useCallback((locale: SupportedLocale) => {
    dynamicActivate(locale);
  }, []);

  return (
    <NounsI18nProvider locale={locale} forceRenderAfterLocaleChange={true} onActivate={onActivate}>
      {children}
    </NounsI18nProvider>
  );
}
