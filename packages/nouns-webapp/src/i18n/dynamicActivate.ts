import { i18n } from '@lingui/core';
import { plurals as supportedPlurals} from './supportedLocales';

export async function dynamicActivate(locale: string) {
  i18n.loadLocaleData(locale, { plurals: () => supportedPlurals[locale] });
  try {
    const catalog = await import(`${process.env.REACT_APP_LOCALES}/${locale}.js`);
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages);
  } catch {}
  i18n.activate(locale);
}
