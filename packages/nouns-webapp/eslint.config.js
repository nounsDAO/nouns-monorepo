import js from '@eslint/js';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
// import reactPlugin from 'eslint-plugin-react';
// import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // ...reactPlugin.configs.flat.recommended,
      // ...importPlugin.flatConfigs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      // react: reactPlugin,
      // import: importPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
