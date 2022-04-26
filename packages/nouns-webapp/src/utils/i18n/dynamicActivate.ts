import { i18n } from '@lingui/core';
import { SupportedLocale } from './supportedLocales';

export async function dynamicActivate(locale: SupportedLocale) {
  i18n.loadLocaleData(locale.locale, { plurals: () => (locale.plurals) });
  try {
    const catalog = await import(`${process.env.REACT_APP_LOCALES}/${locale}.js`);
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale.locale, catalog.messages || catalog.default.messages);
  } catch {}
  i18n.activate(locale.locale);
}
