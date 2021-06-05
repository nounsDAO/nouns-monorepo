# nouns-img-permutator

Script to test Nouns permutations. Extracts attributes directly from .psd file to generate a random permutation.

### .psd file requierements

- Every group must be an attribute of the noun (e.g. 'body', 'accessory', etc)
- Every layer directly within the group must be a layer representing an option for the attribute (e.g. body > green-body)

### Extract layers from .psd files

Drop .psd file in `assets/psd/` and run 

```sh
node extract-layers.js
```

### Generate permutation

In `permutator.js`, edit `attributes` to match `assets/noun-assets` folders from .psd file in order of z-index (first item would be background, second body, etc).

```sh
node permutator.js
```

Output of permutation will be written into `result.png`
