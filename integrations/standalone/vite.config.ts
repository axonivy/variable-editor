import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rolldownOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: { port: 3001 },
  resolve: {
    alias: {
      '@axonivy/variable-editor': resolve(import.meta.dirname, '../../packages/variable-editor/src'),
      '@axonivy/variable-editor-protocol': resolve(import.meta.dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
