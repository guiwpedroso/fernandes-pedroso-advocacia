import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        politica: resolve(import.meta.dirname, 'politica-de-privacidade.html')
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
