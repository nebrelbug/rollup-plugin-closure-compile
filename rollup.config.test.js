import testPlugin from './src/index.js'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'test/testfile.js',
    output: {
      file: 'dist/sum.min.js',
      format: 'umd',
      name: 'sum',
      sourcemap: true
    },
    plugins: [testPlugin()]
  }
]
