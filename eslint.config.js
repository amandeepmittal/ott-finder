const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
  globalIgnores([
    '.expo/**',
    'android/**',
    'ios/**',
    'dist/**',
    'web-build/**',
    'coverage/**',
    'example/**',
    'expo-env.d.ts',
  ]),
  expoConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      curly: ['error', 'all'],
      'no-unused-vars': 'off',
      'no-warning-comments': ['error', { terms: ['@nocommit'] }],
      'react-hooks/exhaustive-deps': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  // Prettier owns formatting. Keep this last to disable conflicting lint rules.
  prettierConfig,
]);
