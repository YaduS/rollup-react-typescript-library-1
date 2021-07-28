import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { defineConfig } from 'rollup';
import deletePlugin from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';

// defineConfig used for intellisense
export default defineConfig({
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
    },
  ],
  plugins: [
    json(),
    postcss({
      // supports scss loaders out of the box so no need to specify anything
      autoModules: true,
      extract: 'css/styles.css', // this will be inside dist/cjs and dist/esm
    }),
    babel({
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: './node_modules/**', // is this necessary?
    }),
    deletePlugin({
      targets: 'dist/*',
    }),
  ],
});
