import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'actions/auction-house': 'src/actions/auction-house.gen.ts',
    'react/auction-house': 'src/react/auction-house.gen.ts',
    'actions/data': 'src/actions/data.gen.ts',
    'react/data': 'src/react/data.gen.ts',
    'actions/descriptor': 'src/actions/descriptor.gen.ts',
    'react/descriptor': 'src/react/descriptor.gen.ts',
    'actions/governor': 'src/actions/governor.gen.ts',
    'react/governor': 'src/react/governor.gen.ts',
    'react/treasury': 'src/react/treasury.gen.ts',
    'actions/treasury': 'src/actions/treasury/index.ts',
    'actions/legacy-treasury': 'src/actions/legacy-treasury.gen.ts',
    'react/legacy-treasury': 'src/react/legacy-treasury.gen.ts',
    'actions/stream-factory': 'src/actions/stream-factory.gen.ts',
    'react/stream-factory': 'src/react/stream-factory.gen.ts',
    'actions/stream': 'src/actions/stream.gen.ts',
    'react/stream': 'src/react/stream.gen.ts',
    'actions/token': 'src/actions/token.gen.ts',
    'react/token': 'src/react/token.gen.ts',
    'actions/usdc-payer': 'src/actions/usdc-payer.gen.ts',
    'react/usdc-payer': 'src/react/usdc-payer.gen.ts',
    'actions/usdc-token-buyer': 'src/actions/usdc-token-buyer.gen.ts',
    'react/usdc-token-buyer': 'src/react/usdc-token-buyer.gen.ts',
  },
  format: ['esm'],
  dts: {
    compilerOptions: {
      composite: false, // https://github.com/egoist/tsup/issues/571#issuecomment-2457920686
    },
  },
  clean: true,
  target: 'es2021',
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: 'terser',
  terserOptions: {
    format: {
      comments: false,
    },
  },
  loader: {
    '.json': 'json',
  },
});
