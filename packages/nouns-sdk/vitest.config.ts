import { defineConfig } from 'vitest/config';
import 'dotenv/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
