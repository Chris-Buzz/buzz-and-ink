import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: 'demo',
  resolve: {
    alias: {
      '@buzz-ink/react': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  server: {
    // the demo pulls ../src (this package) and ../../src (the design system CSS)
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] },
  },
});
