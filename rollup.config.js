import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    json({
      include: 'node_modules/**'
    }),
  ]
}