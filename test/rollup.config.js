import closureCompile from './src/index.js'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'test/shouldwork.js',
    output: {
      file: 'test/dist/sum.min.js',
      format: 'umd',
      name: 'sum',
      sourcemap: true
    },
    plugins: [closureCompile({ level: 'ADVANCED' })]
  }
]
