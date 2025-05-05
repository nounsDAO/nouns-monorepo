import { defineConfig, globalIgnores } from 'eslint/config';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import turbo from 'eslint-plugin-turbo';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: ['**/*.config.js', '**/*.config.ts', '**/*.setup.ts'],
  },
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',

      parserOptions: {
        project: 'packages/*/tsconfig.json',
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      turbo,
    },

    extends: compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),

    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  globalIgnores(['**/*.js', '**/dist', '**/*.d.ts']),
]);
