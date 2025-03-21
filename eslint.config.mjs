import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';
import i18next from 'eslint-plugin-i18next';

export default tseslint.config(
  ...config.base,
  ...config.i18n,
  // TypeScript configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);
