import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    dir: 'src',
    include: ['**/*.test.ts?(x)'],
    alias: {
      '@axonivy/variable-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    },
    globals: true,
    environment: 'jsdom',
    css: false,
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
