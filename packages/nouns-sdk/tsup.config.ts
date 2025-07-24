import { defineConfig } from 'tsup';
import { contractConfigs } from './wagmi.config';

export default defineConfig({
  entry: [
    'src/index.ts',
    ...contractConfigs.flatMap(({ fileName }) => [
      `src/actions/${fileName}.ts`,
      `src/react/${fileName}.ts`,
    ]),
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    };
  },
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
