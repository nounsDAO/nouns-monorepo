## Encoding

The code in this folder can be used to play around with the encoding used to store Noun 'parts' on-chain.

### Current Format

Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].

### Usage

Update `encoded-layers.json`:

```sh
yarn encode
```

Randomly generate a Noun, convert the above format to SVG, and open in your default program (likely the browser):

```sh
yarn decode && open random-noun.svg
```
