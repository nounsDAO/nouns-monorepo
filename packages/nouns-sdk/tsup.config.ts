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
  dts: {
    compilerOptions: {
      composite: false // https://github.com/egoist/tsup/issues/571#issuecomment-2457920686
    }
  },
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
