import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { lingui } from '@lingui/vite-plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import Inspect from 'vite-plugin-inspect';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    nodePolyfills(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          floatPrecision: 2,
        },
        exportType: 'default',
        ref: true,
      },
      include: '**/*.svg?react',
    }),
    Inspect(),
    checker({
      typescript: true,
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      //   useFlatConfig: true
      // },
      overlay: true,
    }),
  ],
  server: {
    port: 3000,
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      '@nouns/assets': path.resolve(__dirname, '../../packages/nouns-assets/dist'),
      '@nouns/sdk': path.resolve(__dirname, '../../packages/nouns-sdk/dist'),
      '@nouns/contracts': path.resolve(__dirname, '../../packages/nouns-contracts/dist'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['fs'],
      output: {
        format: 'esm',
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production builds
        drop_console: true,
      },
    },
  },
});
