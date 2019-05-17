import closureCompile from '../src/index.js'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'example/shouldwork.js',
    output: {
      file: 'example/expected/whitespace.min.js',
      format: 'umd',
      name: 'sum',
      sourcemap: false
    },
    plugins: [closureCompile({ level: 'WHITESPACE_ONLY' })]
  }
]
