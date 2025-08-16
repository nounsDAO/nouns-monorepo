import { formatter } from '@lingui/format-po';
import type { LinguiConfig } from '@lingui/conf';

const linguiConfig: LinguiConfig = {
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**', '**/.next/**', '**/out/**'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {
    pseudo: 'en-US',
  },
  format: formatter({ lineNumbers: false }),
  formatOptions: {
    lineNumbers: false,
  },
  locales: ['en-US', 'ja-JP', 'zh-CN', 'pseudo'],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: 'pseudo',
};

export default linguiConfig;
