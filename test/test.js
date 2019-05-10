import assert from 'assert'
import { rollup } from 'rollup'
import { compile } from 'google-closure-compiler-js'
import { readFileSync } from 'fs'
import closure from '../dist/rollup-plugin-closure-compiler-js.es'

process.chdir('test')

rollup({
  entry: 'fixtures/unminified.js',
  plugins: [closure()]
}).then(bundle => {
  const { code, map } = bundle.generate({
    format: 'cjs'
  })
  const jsFile = readFileSync('fixtures/unminified.js', 'utf-8')
  const { compiledCode } = compile({ jsCode: [{ src: jsFile }] })
  assert.equal(code, compiledCode + '\n')
})
