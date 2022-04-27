import { SupportedLocale } from './locales'
import { initialLocale, useActiveLocale } from '../hooks/useActivateLocale'
import { dynamicActivate, NounsI18nProvider } from './NounsI18nProvider'
import { ReactNode, useCallback } from 'react'

dynamicActivate(initialLocale)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale()

  const onActivate = useCallback(
    (locale: SupportedLocale) => {
      localStorage.setItem("lang", locale);
    },
    []
  );

  return (
    <NounsI18nProvider locale={locale} forceRenderAfterLocaleChange={false} onActivate={onActivate}>
      {children}
    </NounsI18nProvider>
  )
};