const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add rule for .mjs files
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      // Configure SVGR to handle namespace tags
      const svgrRule = webpackConfig.module.rules.find(rule =>
        rule.oneOf && rule.oneOf.some(oneOfRule =>
          oneOfRule.test && oneOfRule.test.toString().includes('svg')
        )
      );

      if (svgrRule && svgrRule.oneOf) {
        // Find all rules that handle SVG files
        svgrRule.oneOf.forEach(rule => {
          if (rule.test && rule.test.toString().includes('svg') && rule.use) {
            // Find the SVGR loader in the use array
            const svgrLoader = rule.use.find(loader =>
              loader.loader && loader.loader.includes('@svgr/webpack')
            );

            if (svgrLoader) {
              // Set throwIfNamespace to false
              svgrLoader.options = {
                ...svgrLoader.options,
                throwIfNamespace: false,
              };
            }
          }
        });
      }

      // Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        fs: false,
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        zlib: require.resolve('browserify-zlib'),
        vm: require.resolve('vm-browserify'),
      };

      // Ignore specific webpack warnings
      webpackConfig.ignoreWarnings = webpackConfig.ignoreWarnings || [];
      webpackConfig.ignoreWarnings.push({
        message: /require function is used in a way/
      });
      webpackConfig.ignoreWarnings.push({
        message: /Failed to parse source map/
      });

      return webpackConfig;
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: require.resolve('process/browser'),
        }),
      ],
    },
  },
};
