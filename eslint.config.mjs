import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

// TypeScript plugins and parsers
import tseslint from 'typescript-eslint';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// React plugins
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Other plugins
import importPlugin from 'eslint-plugin-import';
import linguiPlugin from 'eslint-plugin-lingui';
import prettierPlugin from 'eslint-plugin-prettier';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import turboPlugin from 'eslint-plugin-turbo';
import unicornPlugin from 'eslint-plugin-unicorn';
import vitestPlugin from 'eslint-plugin-vitest';

// Compatibility layer for traditional configs
const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  // Commonly ignores
  {
    ignores: [
      '**/node_modules/*',
      '**/dist',
      '**/*.config.{js,mjs,ts,mts}',
      '**/*.setup.ts',
      '**/.netlify',
      'packages/nouns-subgraph/src/types/*',
      'packages/nouns-webapp/src/contracts/*',
      'packages/nouns-webapp/src/subgraphs/*',
    ],
  },

  // Base TypeScript configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      import: importPlugin,
      lingui: linguiPlugin,
      prettier: prettierPlugin,
      sonarjs: sonarjsPlugin,
      turbo: turboPlugin,
      unicorn: unicornPlugin,
      vitest: vitestPlugin,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended-legacy',
        'plugin:prettier/recommended',
        'prettier',
      ),
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Import plugin rules
      'import/no-unresolved': 'error',
      'import/named': 'warn',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/export': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '**/*.{css,scss,sass,less,module.css,module.scss}',
              group: 'object',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // Lingui plugin rules
      'lingui/no-unlocalized-strings': 'off',
      'lingui/t-call-in-function': 'error',
      'lingui/no-single-variables-to-translate': 'error',
      // Prettier rules
      'prettier/prettier': 'error',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'packages/*/{ts,js}config.json',
        },
      },
    },
  },

  // Additional React-specific rules only for the webapp package
  {
    files: ['**/packages/nouns-webapp/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      prettier: prettierPlugin,
    },
    extends: [...compat.extends('plugin:react/recommended', 'plugin:prettier/recommended')],
    rules: {
      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      // Prettier rules
      'prettier/prettier': 'error',
    },
  },

  // Base JS configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [js.configs.recommended, ...compat.extends('plugin:prettier/recommended')],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Import plugin rules for JS files
      'import/no-unresolved': 'error',
      'import/named': 'warn',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/export': 'error',
      // Prettier rules
      'prettier/prettier': 'error',
    },
  },

  // Global ignores
  globalIgnores(['**/*.d.ts']),
]);
