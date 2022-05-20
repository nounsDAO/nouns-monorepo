/**
 * Taken from https://github.com/Uniswap/interface/blob/main/lingui.config.ts with minor modifications
 */
const linguiConfig = {
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['<rootDir>/src'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {
    default: 'en-US',
    pseudo: 'en-US',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: ['en-US', 'ja-JP', 'pseudo'],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: 'pseudo',
};

export default linguiConfig;
