import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { lingui } from '@lingui/vite-plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

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
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@nouns/assets': path.resolve(__dirname, '../../packages/nouns-assets/dist'),
      '@nouns/sdk': path.resolve(__dirname, '../../packages/nouns-sdk/dist'),
      '@nouns/contracts': path.resolve(__dirname, '../../packages/nouns-contracts/dist'),
    },
  },
  build: {
    rollupOptions: {
      external: ['fs'],
      output: {
        format: 'esm',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // REACT ECOSYSTEM - Split React packages into optimized chunks
            // React DOM components
            if (id.includes('react-dom/client')) return 'react-dom-client';
            if (id.includes('react-dom/server')) return 'react-dom-server';
            if (id.includes('react-dom')) return 'react-dom-core';

            // React core and supporting libraries
            if (id.includes('scheduler')) return 'react-scheduler';
            if (id.includes('react/jsx-runtime') || id.includes('react/jsx-dev-runtime'))
              return 'react-jsx';
            if (id.includes('react-is')) return 'react-is';
            if (id.includes('react')) return 'react-minimal';

            // React UI frameworks and extensions
            if (id.includes('react-transition-group')) return 'react-transitions';
            if (id.includes('react-bootstrap')) return 'react-bootstrap';
            if (id.includes('react-redux')) return 'react-redux';
            if (id.includes('react-transition') || id.includes('react-tooltip'))
              return 'react-ui-utils';

            // WEB3 / BLOCKCHAIN LIBRARIES - Fine-grained chunking for Web3 dependencies
            // EthersProject modules by functionality
            if (id.includes('@ethersproject')) {
              if (id.includes('@ethersproject/providers')) return 'ethers-providers';
              if (id.includes('@ethersproject/contracts')) return 'ethers-contracts';
              if (id.includes('@ethersproject/wallet')) return 'ethers-wallet';
              if (id.includes('@ethersproject/bignumber')) return 'ethers-bignumber';
              if (id.includes('@ethersproject/hash')) return 'ethers-hash';
              if (id.includes('@ethersproject/bytes')) return 'ethers-bytes';
              if (id.includes('@ethersproject/abi')) return 'ethers-abi';
              return 'ethers-utils'; // Catch-all for remaining ethers packages
            }

            // Other Web3 and blockchain libraries
            if (id.includes('ethers')) return 'ethers';
            if (id.includes('@walletconnect')) return 'walletconnect';
            if (id.includes('@web3-react')) return 'web3-react';
            if (id.includes('@usedapp')) return 'web3-usedapp';
            if (id.includes('bignumber.js')) return 'web3-math';

            // PROJECT-SPECIFIC DEPENDENCIES
            if (id.includes('@nouns') || id.includes('@noundry')) return 'nouns';
            if (id.includes('@fortawesome')) return 'fortawesome';

            // COMMON FRONTEND LIBRARIES - Organized by functionality
            // UI and styling
            if (id.includes('bootstrap') || id.includes('react-bootstrap')) return 'ui-bootstrap';
            if (id.includes('framer-motion')) return 'animations';
            if (id.includes('classnames') || id.includes('clsx')) return 'css-utils';

            // Data management
            if (id.includes('redux') || id.includes('@reduxjs')) return 'state-management';
            if (id.includes('@apollo')) return 'graphql';
            if (id.includes('axios') || id.includes('graphql')) return 'data-fetching';

            // Utilities and tools
            if (id.includes('dayjs')) return 'date-utils';
            if (id.includes('ramda')) return 'functional-utils';
            if (id.includes('lingui')) return 'i18n-lingui';
            if (id.includes('react-router')) return 'routing';
            if (id.includes('remark')) return 'markdown';

            // FALLBACK CHUNKING STRATEGY - Distribute remaining deps alphabetically
            const pkgName = id.split('node_modules/').pop()?.split('/')[0];
            if (pkgName) {
              const firstChar = pkgName.charAt(0).toLowerCase();
              if ('abcde'.includes(firstChar)) return 'vendor-a-e';
              if ('fghij'.includes(firstChar)) return 'vendor-f-j';
              if ('klmno'.includes(firstChar)) return 'vendor-k-o';
              if ('pqrst'.includes(firstChar)) return 'vendor-p-t';
              return 'vendor-u-z';
            }

            // Default vendor chunk for anything else
            return 'vendor';
          }
        },
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
