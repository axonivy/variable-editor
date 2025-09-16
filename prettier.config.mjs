import base from '@axonivy/prettier-config';

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...base,
  tailwindStylesheet: 'packages/variable-editor/src/index.css'
};

export default config;
