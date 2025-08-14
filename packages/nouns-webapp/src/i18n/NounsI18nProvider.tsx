import { ReactNode, useEffect } from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { DEFAULT_LOCALE, SupportedLocale } from './locales';

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

  // Initialize the locale immediately if it is DEFAULT_LOCALE, so that keys are shown while the translation messages load.
  // This renders the translation _keys_, not the translation _messages_, which is only acceptable while loading the DEFAULT_LOCALE,
  // as [there are no "default" messages"](https://github.com/lingui/js-lingui/issues/388#issuecomment-497779030).
  // See https://github.com/lingui/js-lingui/issues/1194#issuecomment-1068488619.
  if (i18n.locale == undefined && locale === DEFAULT_LOCALE) {
    i18n.load(DEFAULT_LOCALE, {});
    i18n.activate(DEFAULT_LOCALE);
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
