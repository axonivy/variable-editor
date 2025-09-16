import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: { port: 3001 },
  resolve: {
    alias: {
      '@axonivy/variable-editor': resolve(__dirname, '../../packages/variable-editor/src'),
      '@axonivy/variable-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
