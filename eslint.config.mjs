import { defineConfig, globalIgnores } from 'eslint/config';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// React plugins
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Other plugins
import unicornPlugin from 'eslint-plugin-unicorn';
import turboPlugin from 'eslint-plugin-turbo';
import importPlugin from 'eslint-plugin-import';
import linguiPlugin from 'eslint-plugin-lingui';
import vitestPlugin from 'eslint-plugin-vitest';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import prettierPlugin from 'eslint-plugin-prettier';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: [
      '**/node_modules/*',
      '**/dist',
      '**/*.config.{js,mjs,ts,mts}',
      '**/*.setup.ts',
      '**/.netlify',
      'packages/nouns-subgraph/src/types/*',
    ],
  },
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',

      parserOptions: {
        project: true,
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      turbo: turboPlugin,
      unicorn: unicornPlugin,
      import: importPlugin,
      lingui: linguiPlugin,
      sonarjs: sonarjsPlugin,
      prettier: prettierPlugin,
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
      "import/order": ["error", {
        "groups": [
          // Type imports first
          "type",
          // Imports of builtins second
          "builtin",
          // Then external packages
          "external",
          // Then sibling and parent imports. They can be mingled together
          ["sibling", "parent"],
          // Then index file imports
          "index",
          // Then any arcane TypeScript imports
          "object",
          // Then the rest: internal, unknown
          "internal",
          "unknown"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
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
