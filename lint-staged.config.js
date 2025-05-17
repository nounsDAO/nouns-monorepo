/**
 * @type {import('lint-staged').Config}
 */
module.exports = {
  // only run on your source files
  '**/src/**/*.{js,jsx,ts,tsx}': [
    'prettier --write --cache --cache-location .cache/.prettiercache',
    'eslint --fix --cache --cache-location .cache/.eslintcache',
  ],
  '**/src/**/*.{json,yaml,yml,md,mdx}': [
    'prettier --write --cache --cache-location .cache/.prettiercache',
  ],
};
