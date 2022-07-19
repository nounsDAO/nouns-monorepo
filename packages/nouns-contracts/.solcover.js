module.exports = {
  skipFiles: [
    // WETH is for testing purposes only
    'test/WETH.sol',
  ],
  configureYulOptimizer: true,
  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }
};
