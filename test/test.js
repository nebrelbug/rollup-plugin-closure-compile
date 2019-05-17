/* eslint-env mocha */

var assert = require('assert')
var rollup = require('rollup')
var closureCompile = require('../dist/closure-compiler-rollup.js')
var readFileSync = require('fs').readFileSync

process.chdir('test') // Set the 'test' directory to where all of the files are referenced from

async function assertThrowsAsync (fn, regExp) {
  // Taken from https://stackoverflow.com/a/46957474/7983596
  let f = () => {}
  try {
    await fn()
  } catch (e) {
    f = () => {
      throw e
    }
  } finally {
    assert.throws(f, regExp)
  }
}

describe('rollup-plugin-closure-compile', function () {
  // Disabling Mocha's timeout, since Closure Compiler takes a long time
  this.timeout(0)

  it('should compile', async function () {
    // create a bundle
    const bundle = await rollup.rollup({
      input: '../example/shouldwork.js',
      plugins: [closureCompile()]
    })

    // generate code
    const { output } = await bundle.generate({
      format: 'umd',
      name: 'sum'
    })

    var compiledCode = readFileSync('../example/expected/sum.min.js', 'utf-8')
    assert.strict.equal(output[0].code, compiledCode)
  })

  it('should compile with different compilation levels', async function () {
    // create a bundle
    const bundle = await rollup.rollup({
      input: '../example/shouldwork.js',
      plugins: [
        closureCompile({
          compilationLevel: 'WHITESPACE_ONLY'
        })
      ]
    })

    // generate code
    const { output } = await bundle.generate({
      format: 'umd',
      name: 'sum'
    })

    var compiledCode = readFileSync(
      '../example/expected/whitespace.min.js',
      'utf-8'
    )
    assert.strict.equal(output[0].code, compiledCode)
  })

  it('should error in advanced mode with an undefined variable', async function () {
    await assertThrowsAsync(async function () {
      // create a bundle
      const bundle = await rollup.rollup({
        input: '../example/shoulderr.js',
        plugins: [
          closureCompile({
            level: 'ADVANCED'
          })
        ]
      })

      // generate code
      await bundle.generate({
        format: 'umd',
        name: 'sum'
      })
    }, /Error/)
  })

  it('should compile with sourcemaps', async function () {
    // create a bundle
    const bundle = await rollup.rollup({
      input: '../example/shouldwork.js',
      plugins: [closureCompile()]
    })

    // generate code
    const { output } = await bundle.generate({
      format: 'umd',
      name: 'sum',
      sourcemap: true
    })

    const map = output[0].map
    assert.ok(map, 'has a source map')
    assert.ok(Array.isArray(map.sources), 'source map has sources array')
    assert.strict.equal(map.sources.length, 2, 'source map has two sources')
    assert.ok(Array.isArray(map.names), 'source maps has names array')
    assert.ok(map.mappings, 'source map has mappings')
  })
})
