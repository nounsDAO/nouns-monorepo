/**
 * NounsI18nProvider.tsx is a modified version of https://github.com/Uniswap/interface/blob/main/src/lib/i18n.tsx
 */
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { DEFAULT_LOCALE, SupportedLocale } from './locales';
import { ReactNode, useEffect } from 'react';

export async function dynamicActivate(locale: SupportedLocale) {
  console.log(`Starting locale activation for: ${locale}`);

  try {
    // Use a standard import without the loader syntax
    const catalog = await import(`../locales/${locale}.po`);

    // Check if catalog loaded successfully
    if (catalog && (catalog.messages || catalog.default)) {
      // Load the messages into i18n
      i18n.load(locale, catalog.messages || catalog.default);
      console.log(`Successfully loaded messages for ${locale}`);
    } else {
      console.error(`Catalog loaded but no messages found for ${locale}`);
    }
  } catch (error) {
    console.error(`Failed to load messages for ${locale}:`, error);
  }

  // Activate the locale
  console.log('Activating locale:', locale);
  i18n.activate(locale);
}

interface ProviderProps {
  locale: SupportedLocale;
  forceRenderAfterLocaleChange?: boolean;
  onActivate?: (locale: SupportedLocale) => void;
  children: ReactNode;
}

export function NounsI18nProvider({ locale, onActivate, children }: ProviderProps) {
  useEffect(() => {
    dynamicActivate(locale)
      .then(() => onActivate?.(locale))
      .catch(error => {
        console.error('Failed to activate locale', locale, error);
      });
  }, [locale, onActivate]);

  // Initialize the locale immediately if it is DEFAULT_LOCALE, so that keys are shown while the translation messages load.
  // This renders the translation _keys_, not the translation _messages_, which is only acceptable while loading the DEFAULT_LOCALE,
  // as [there are no "default" messages](https://github.com/lingui/js-lingui/issues/388#issuecomment-497779030).
  // See https://github.com/lingui/js-lingui/issues/1194#issuecomment-1068488619.
  if (i18n.locale === undefined && locale === DEFAULT_LOCALE) {
    i18n.load(DEFAULT_LOCALE, {});
    i18n.activate(DEFAULT_LOCALE);
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
