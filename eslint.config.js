// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

// React Compiler Linter (bonus). Je kunt 'm ook weglaten als je 'm niet wilt.
let reactCompiler;
try {
  reactCompiler = require('eslint-plugin-react-compiler');
} catch {
  reactCompiler = null;
}

module.exports = defineConfig([
  // Expo basisregels
  ...expo,

  // TypeScript-versterking (flat config)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Project-aware rules (noUnusedVars etc.) met type-informatie:
        project: true,
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      ...(reactCompiler ? { 'react-compiler': reactCompiler } : {})
    },
    rules: {
      // Clean TS
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': true,
        'ts-expect-error': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false
      }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],

      // React Compiler Linter (bonus): zet op 'off' als je hem (nog) niet wil
      ...(reactCompiler ? { 'react-compiler/react-compiler': 'warn' } : {})
    }
  },

  // Ignore folders
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]);
