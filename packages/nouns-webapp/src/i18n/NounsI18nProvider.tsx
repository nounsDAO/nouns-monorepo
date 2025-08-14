import { ReactNode, useEffect } from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { SupportedLocale } from './locales';

// Per latest Lingui docs: import .po and load+activate directly
export async function dynamicActivate(locale: SupportedLocale) {
  try {
    const { messages } = await import(`../locales/${locale}.po`);
    // Prefer the modern API that both loads and activates in one call
    i18n.loadAndActivate({ locale, messages });
  } catch (error) {
    console.error(`Failed to load messages for ${locale}:`, error);
    // Fallback to just activating the locale to avoid crashing the app
    i18n.activate(locale);
  }
}

interface ProviderProps {
  locale: SupportedLocale;
  forceRenderAfterLocaleChange?: boolean;
  onActivate?: (locale: SupportedLocale) => void;
  children: ReactNode;
}

export function NounsI18nProvider({ locale, onActivate, children }: Readonly<ProviderProps>) {
  useEffect(() => {
    dynamicActivate(locale)
      .then(() => onActivate?.(locale))
      .catch(error => {
        console.error('Failed to activate locale', locale, error);
      });
  }, [locale, onActivate]);

  // Ensure i18n is activated before first render to avoid I18nProvider rendering null in dev.
  // We activate with the requested locale immediately; messages are loaded asynchronously in useEffect above.
  // This may briefly render message IDs until dynamicActivate(locale) finishes.
  if (i18n.locale == undefined) {
    i18n.activate(locale);
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
