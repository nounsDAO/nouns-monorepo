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
  loader: {
    '.json': 'json',
  },
  tsconfig: 'tsconfig.build.json',
});
