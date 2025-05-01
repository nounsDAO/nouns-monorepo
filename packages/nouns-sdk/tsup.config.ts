import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
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
