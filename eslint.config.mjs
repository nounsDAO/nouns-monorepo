import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

// TypeScript plugins and parsers
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

// React plugins
import eslintReactPlugin from '@eslint-react/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Other plugins
import importPlugin from 'eslint-plugin-import';
import linguiPlugin from 'eslint-plugin-lingui';
import prettierPlugin from 'eslint-plugin-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
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
      // Build and dependency directories
      '**/node_modules/*',
      '**/dist',
      '**/.netlify',

      // Configuration files
      '**/*.config.{js,mjs,ts,mts}',
      '**/*.setup.{js,mjs,ts,mts}',

      // Generated code (use a more consistent pattern)
      '**/typechain/**',
      '**/src/{types,contracts,subgraphs}/**',
      '**/*.gen.ts',
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
        // Enable project service for better TypeScript integration
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      import: importPlugin,
      lingui: linguiPlugin,
      prettier: prettierPlugin,
      turbo: turboPlugin,
      unicorn: unicornPlugin,
      'unused-imports': unusedImportsPlugin,
      vitest: vitestPlugin,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
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
      // SonarJS plugin rules
      'sonarjs/todo-tag': 'warn',
      // Unicorn plugin rules
      'unicorn/better-regex': 'error',
      'unicorn/no-nested-ternary': 'error',
      // Unused imports plugin rules
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Prettier rules
      'prettier/prettier': 'warn',
    },
    settings: {
      ...importPlugin.configs.typescript.settings,
      'import/resolver': {
        ...importPlugin.configs.typescript.settings['import/resolver'],
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // nouns-docs specific configuration
  {
    files: ['**/packages/nouns-docs/**/*.{ts,tsx}'],
    settings: {
      ...importPlugin.configs.typescript.settings,
      'import/resolver': {
        ...importPlugin.configs.typescript.settings['import/resolver'],
        typescript: {
          project: 'packages/nouns-docs/tsconfig.json',
        },
      },
    },
  },

  // Additional React-specific rules only for the webapp package
  {
    files: ['**/packages/nouns-webapp/**/*.{ts,tsx}'],
    settings: {
      ...importPlugin.configs.typescript.settings,
      'import/resolver': {
        ...importPlugin.configs.typescript.settings['import/resolver'],
        typescript: {
          project: 'packages/nouns-webapp/tsconfig.json',
        },
      },
    },
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
    extends: [
      ...compat.extends('plugin:react/recommended', 'plugin:prettier/recommended'),
      eslintReactPlugin.configs['recommended-typescript'],
    ],
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
      // ESLint React rules
      '@eslint-react/no-class-component': 'error',
      // Typescript eslint rules
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableString: true,
        },
      ],
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: '@apollo/client',
              message:
                'Use @tanstack/react-query instead. ref: https://the-guild.dev/graphql/codegen/docs/guides/react-query#type-safe-graphql-operation-execution',
            },
            {
              name: 'react-bootstrap',
              message: 'Use tailwindcss instead',
            },
          ],
          patterns: [
            {
              regex: '.*redux.*',
              message: 'Use jotai and @tanstack/react-query instead',
            },
            {
              group: ['lucide-react'],
              allowImportNamePattern: '^(IconNode|LucideIcon|LucideProps|SVGAttributes|.+Icon)$',
              message:
                'Import specific *Icon exports instead of generic names. e.g. DownloadIcon instead of Download',
            },
          ],
        },
      ],
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
      'prettier/prettier': 'warn',
    },
  },

  // Global ignores
  globalIgnores(['**/*.d.ts']),
]);
