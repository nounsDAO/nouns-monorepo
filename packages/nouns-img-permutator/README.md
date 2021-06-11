# nouns-img-permutator

Web app run on Firebase to test Noun permutations. 

### External

https://nouns.wtf

### Internal

https://nounsdao-dev.web.app/

## Branch based sourcing

To generate a new source for the generator, branch off of `img-permutator` using the following format to name the new branch: 

```
img-permutator-preview/src-YOUR_BRANCH_NAME
```

A Github Action will then auto-deploy the `assets/` directory of the new branch to Google Cloud Storage for the generator to source from.

## Hosting

### Build

```
npm install
```

### Run emulators

```
firebase emulators:start --only hosting
```

## Cloud functions

### Build

Change directory to `functions/` and run:

```
npm install
```

### Run emulators

```
firebase emulators:start --only functions
```
