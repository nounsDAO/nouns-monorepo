/**
 * NounsI18nProvier.tsx is a modified version of https://github.com/Uniswap/interface/blob/main/src/lib/i18n.tsx
 */
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { DEFAULT_LOCALE, SupportedLocale } from './locales';
import { en, ja } from 'make-plural/plurals';
import { PluralCategory } from 'make-plural/plurals';
import { ReactNode, useEffect } from 'react';

type LocalePlural = {
  [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory;
};

const plurals: LocalePlural = {
  'en-US': en,
  'ja-JP': ja,
  pseudo: en,
};

export async function dynamicActivate(locale: SupportedLocale) {
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
  try {
    const catalog = await import(`../locales/${locale}.js`);
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages);
  } catch {}
  console.log('activating: ', locale);
  i18n.activate(locale);
}

interface ProviderProps {
  locale: SupportedLocale;
  forceRenderAfterLocaleChange?: boolean;
  onActivate?: (locale: SupportedLocale) => void;
  children: ReactNode;
}

export function NounsI18nProvider({
  locale,
  forceRenderAfterLocaleChange = true,
  onActivate,
  children,
}: ProviderProps) {
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
    i18n.loadLocaleData(DEFAULT_LOCALE, { plurals: () => plurals[DEFAULT_LOCALE] });
    i18n.load(DEFAULT_LOCALE, {});
    i18n.activate(DEFAULT_LOCALE);
  }

  return (
    <I18nProvider forceRenderOnLocaleChange={forceRenderAfterLocaleChange} i18n={i18n}>
      {children}
    </I18nProvider>
  );
}
