# Nouns Website

This contains the primary website for the Nouns project. It'll be built out using "vanilla html/css, bootstrap, js/ts and ethers.js". These static pages/files are located in `build/` within this package.

## Automated Deployment

This site is automatically deployed to https://nouns-home.netlify.app/ via Netlify, the production branch is currently `master`.

## Pull Request Previews

This deployment is configured to support pull request deployments. After opening a pull request, see the `Checks` portion of the GitHub UI for the preview link.

## Netlify Functions

This package also includes serverless functions to be deployed on Netlify. Simply create functions in the [functions](./functions) directory and see the [Netlify function documentation](https://docs.netlify.com/functions/overview/).

### Local Development

To test Netlify functions locally, install the [Netlify CLI tool](https://docs.netlify.com/cli/get-started/) and run `netlify dev` from this directory. The CLI will read [netlify.toml](./netlify.toml) and pick up the functions directory. There will be an output line from the CLI tool that says `◈ Functions server is listening on XXXX` indicating which port the function server is on. You can execute the functions by navigating to `http://localhost:XXXX/<function name>`.
