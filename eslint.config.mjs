import nx from '@nx/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/node_modules', '**/pnpm-lock.yaml'],
  },
  {
    plugins: {
      '@nx': nx,
    },
    rules: {
      '@stylistic/semi': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .extends(
      'airbnb-base',
      'airbnb-typescript/base',
      'plugin:@nx/typescript',
      'plugin:prettier/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  ...compat
    .extends(
      'airbnb-base',
      'plugin:@nx/javascript',
      'plugin:prettier/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx'],
    })),
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
  ...compat
    .extends(
      'airbnb',
      'airbnb-typescript',
      'plugin:@nx/react-typescript',
      'plugin:prettier/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      'react/react-in-jsx-scope': 'off',
      'import/no-extraneous-dependencies': 'off',
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {},
  },
];
