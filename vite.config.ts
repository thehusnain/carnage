import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwind()],
  build: { rollupOptions: { input: {
    main: resolve(import.meta.dirname, 'index.html'),
    nova: resolve(import.meta.dirname, 'references/nova-ai/index.html'),
    amber: resolve(import.meta.dirname, 'references/amber-capabilities/index.html'),
  } } },
});
