## Encoding

This code in this folder can be used to play around with the encoding used to store Noun 'parts' on-chain.

### Current Format

Color Index (2 bytes), Length (2 bytes), X-Y Coordinate Tuples [1 Byte, 1 Byte].

## Usage

First, `cd` into this folder.

Update `encoded-layers.json`:

```sh
ts-node encode.ts
```

Randomly generate a Noun, convert the above format to SVG, and open in your default program (likely the browser):

```sh
ts-node decode.ts && open random-noun.svg
```
