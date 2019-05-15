import closureCompile from '../src/index.js'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'example/shouldwork.js',
    output: {
      file: 'example/dist/sum.min.js',
      format: 'umd',
      name: 'sum',
      sourcemap: true
    },
    plugins: [closureCompile({ level: 'SIMPLE' })]
  }
]
