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
    default: 'pt-BR',
    pseudo: 'en-US',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: ['pt-BR', 'en-US', 'ja-JP', 'pseudo'],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'pt-BR',
  pseudoLocale: 'pseudo',
};

export default linguiConfig;
