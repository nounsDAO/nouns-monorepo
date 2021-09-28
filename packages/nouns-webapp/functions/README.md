# Nouns Serverless API

`nouns.wtf` provides a serverless API to make fetching data about the Nouns ecosystem easier. [An Insomnia manifest is provided for example.](./docs/insomnia.json)

## Keeping Up To Date

Nouns is a new project and these API endpoints may change, be sure to join [`#developers` in the Nouns Discord](https://discord.gg/nouns) to keep informed.

## API Convention

`https://nouns.wtf/.netlify/functions/<version>/<function name>`

## `V0`

The `V0` namespace is an incubator for serverless functions before the next stable version release. Functions within this namespace may change before becoming promoted. Once promoted to "stable" they'll get their final function names and will be locked in. Any further function changes will result in new function names on breaking changes.

### `GET /v0-noun-owners`

The `noun-owners` endpoint will return an array of all Nouns, their owner's address, and the address it is delegated to - if any.

#### Response
```ts
NormalizedNoun {
  id: number;
  owner: string;
  delegatedTo?: string;
}
```

### `POST /v0-verify-signature`

The `verify-signature` endpoint will attempt to validate a signature payload and optionally check to see if the address owns or is delegated a Noun if the signature is valid. A client can provide the request parameter `?fetchParticipation=true` to check for delegation and ownership while validating the message signature.

#### Request Body

An `application/json` encoded signature like from the [nouns.wtf sign page](https://nouns.wtf/sign).

```ts
VerifySignatureRequest {
	// The message that has been signed
	message: string;
	// The signature data
	signature: string;
	// The address signing the message
	signer: string;
}
```

#### Response Body
```ts
VerifySignatureResponse {
  // Message provided
  message: string;
  // Signature provided
  signature: string;
  // Signer provided from the supplied request body
  providedSigner: string;
  // Address recovered from the signed message
  recoveredAddress: string;
  // If the signature of the message is valid and the provided signer matches
  validSignature: Boolean;
  // If the address has been delegated a Noun vote
  isNounDelegate?: Boolean;
  // If the address owns a Noun
  isNounOwner?: Boolean;
}
```

### `POST /v0-is-noun-owner`

The `is-noun-owner` endpoint will check if the provided address is an owner of a Noun.

#### Request Body

The request body should contain only the address to check.

#### Response

The endpoint will return a boolean `true` or `false` if the address owns a Noun.

### `POST /v0-is-noun-delegate`

The `is-noun-delegate` endpoint will check if the provided address has been delegated voting power of a Noun.

#### Request Body

The request body should contain only the address to check.

#### Response

The endpoint will return a boolean `true` or `false` if the address has been delegated a Noun's vote.

