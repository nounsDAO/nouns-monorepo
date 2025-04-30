import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { lingui } from '@lingui/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
  ],
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
    },
  },
});
