import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  // TypeScript configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    ...i18next.configs['flat/recommended'],
    files: ['packages/variable-editor/src/**/*.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          mode: 'jsx-only',
          'jsx-attributes': { include: ['label', 'aria-label', 'title', 'name'] }
        }
      ]
    }
  },
  {
    name: 'ignore-files',
    ignores: ['**/i18next-parser.config.mjs']
  }
);
