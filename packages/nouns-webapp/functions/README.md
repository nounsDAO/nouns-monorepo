# Nouns Serverless API

`nouns.wtf` provides a serverless API to make fetching data about the Nouns ecosystem easier. [An Insomnia manifest is provided for example.](./docs/insomnia.json)

## Keeping Up To Date

Nouns is a new project and these API endpoints may change, be sure to join [`#developers` in the Nouns Discord](https://discord.gg/nouns) to keep informed.

## API Convention

`https://nouns.wtf/.netlify/functions/<version>/<function name>`

## `V0`

The `V0` namespace is an incubator for serverless functions before the next stable version release. Functions within this namespace may change before becoming promoted. Once promoted to "stable" they'll get their final function names and will be locked in. Any further function changes will result in new function names on breaking changes.

## Endpoints and Schema

See the [OpenAPI Spec File for detailed information about the API](docs/swagger.yaml).
