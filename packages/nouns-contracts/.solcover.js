module.exports = {
  skipFiles: [
    // WETH is for testing purposes only
    'test',
  ],
  configureYulOptimizer: true,
  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }
};
