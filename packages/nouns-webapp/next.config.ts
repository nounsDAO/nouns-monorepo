import type { NextConfig } from 'next';
import * as path from 'path';

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    // Enable webpack 5 features
    esmExternals: true,

    // Enable server components and SWC plugins
    swcPlugins: [
      [
        "@lingui/swc-plugin",
        {
          // Additional Configuration for Lingui SWC plugin
          rootMode: "upward",
        },
      ],
    ],
  },

  // Output configuration
  output: 'standalone',

  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // SVGR support for SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          resourceQuery: /react/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  floatPrecision: 2,
                },
                exportType: 'default',
                ref: true,
              },
            },
          ],
        },
        {
          type: 'asset/resource',
        },
      ],
    });

    // Load gettext .po files using Lingui loader (per latest docs)
    config.module.rules.push({
      test: /\.po$/i,
      use: [{ loader: '@lingui/loader' }],
    });

    // Node.js polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        module: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
      };
    }

    // Path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@nouns/assets': path.resolve(__dirname, '../nouns-assets/dist'),
      '@nouns/sdk': path.resolve(__dirname, '../nouns-sdk/dist'),
      '@nouns/contracts': path.resolve(__dirname, '../nouns-contracts/dist'),
      '@': path.resolve(__dirname, './src'),
      'react-router': path.resolve(__dirname, './src/utils/react-router-shim'),
    };

    // Allow generated subgraph code to import .js while using .ts files
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    } as any;

    // Suppress known dynamic require warnings from cosmiconfig/import-fresh/typescript used by Lingui macros
    const prevIgnore = config.ignoreWarnings ?? [];
    const ignoreFn = (warning: any) =>
      typeof warning?.message === 'string' &&
      warning.message.includes('Critical dependency: the request of a dependency is an expression') &&
      /node_modules\/(cosmiconfig|import-fresh|typescript)/.test(warning?.module?.resource || '');
    (config as any).ignoreWarnings = Array.isArray(prevIgnore)
      ? [...prevIgnore, ignoreFn]
      : [ignoreFn];

    return config;
  },

  // Compiler configuration (SWC-specific)
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',

    // Enable SWC relay plugin if you're using Relay
    // relay: {
    //   src: './src',
    //   artifactDirectory: './src/__generated__',
    //   language: 'typescript',
    // },

    // Enable styled-components support if needed
    // styledComponents: true,
  },

  // TypeScript configuration
  typescript: {
    // Allow production builds to complete despite TypeScript errors
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // Allow production builds to complete despite ESLint errors
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    // Configure image domains if needed
    domains: [],
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/auction/:id',
        destination: '/noun/:id',
        permanent: true,
      },
      {
        source: '/explore',
        destination: '/nouns',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
