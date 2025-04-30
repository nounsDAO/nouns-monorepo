import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  esbuild: {
    target: 'es2018', // Specify ES2018 or later
  },
  resolve: {
    alias: {
      '@nouns/assets': path.resolve(__dirname, '../../packages/nouns-assets/dist'),
      '@nouns/sdk': path.resolve(__dirname, '../../packages/nouns-sdk/dist'),
      '@nouns/contracts': path.resolve(__dirname, '../../packages/nouns-contracts/dist'),
    }
  },
  build: {
    rollupOptions: {
      external: ['fs'],
    },
  },
})
