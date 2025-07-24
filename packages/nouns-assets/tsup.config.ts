import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      composite: false, // ref: https://github.com/egoist/tsup/issues/571#issuecomment-2457920686
    },
  },
  clean: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    };
  },
  target: 'es2020',
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
