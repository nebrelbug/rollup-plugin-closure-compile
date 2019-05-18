// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/closure-compiler-rollup.js',
      format: 'umd',
      name: 'sum',
      sourcemap: true
    },
    plugins: []
  }
]
