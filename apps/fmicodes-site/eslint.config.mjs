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
    ignores: ['!**/*', '.next/**/*', '**/*.config.js', '**/*.config.ts'],
  },
  ...compat.extends(
    'plugin:@nx/react-typescript',
    'next',
    'next/core-web-vitals',
    '../../eslint.config.mjs',
  ),
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },

      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: [
          'apps/fmicodes-site/tsconfig.json',
          'apps/fmicodes-site/tsconfig.spec.json',
        ],
      },
    },

    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    rules: {
      '@next/next/no-html-link-for-pages': [
        'error',
        'apps/fmicodes-site/pages',
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
];
