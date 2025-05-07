/** @type {import('prettier').Config} */
module.exports = {
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  printWidth: 100,
  overrides: [
    {
      files: '*.sol',
      options: {
        printWidth: 120,
        bracketSpacing: true,
      },
    },
  ],
};
