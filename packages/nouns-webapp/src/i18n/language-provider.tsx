/**
 * LanguageProvider.tsx is a modified version of https://github.com/Uniswap/interface/blob/main/src/lib/i18n.tsx
 */
import { ReactNode } from 'react';

import { useActiveLocale } from '@/hooks/useActivateLocale';

import { NounsI18nProvider } from './nouns-i18n-provider';

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const locale = useActiveLocale();

  return (
    <NounsI18nProvider locale={locale} forceRenderAfterLocaleChange={true}>
      {children}
    </NounsI18nProvider>
  );
}
