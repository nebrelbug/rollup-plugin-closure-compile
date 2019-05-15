/* eslint-env mocha */

var assert = require('assert')
var rollup = require('rollup')
var closureCompile = require('../dist/closure-compiler-rollup.js')
var readFileSync = require('fs').readFileSync
/*
process.chdir('test')

describe('rollup-plugin-closure-compile', function () {
  // because closure-compiler takes time
  this.timeout(0)

  it('should compile', () => {
    return rollup({
      input: '../example/shouldwork.js',
      plugins: [closureCompile()]
    }).then(bundle => {
      bundle
        .generate({
          format: 'umd',
          name: 'sum'
        })
        .then(output => {
          var compiledCode = readFileSync(
            'example/expected/sum.min.js',
            'utf-8'
          )
          console.log(JSON.stringify(output))
          assert.strict.equal(output.code, compiledCode + '\n')
        })
    })
  })

  it('should compile via closure-compiler options', () => {
    return rollup({
      input: 'example/shouldwork.js',
      plugins: [
        closureCompile({
          compilationLevel: 'WHITESPACE_ONLY'
        })
      ]
    }).then(bundle => {
      const { code } = bundle.generate({
        format: 'umd',
        name: 'sum'
      })
      var compiledCode = readFileSync(
        'example/expected/whitespace.min.js',
        'utf-8'
      )

      assert.strict.equal(code, compiledCode + '\n')
    })
  })

  it('should error in advanced mode with undefined var', () => {
    assert.throws(function () {
      rollup({
        input: 'example/shoulderr.js',
        plugins: [
          closureCompile({
            level: 'ADVANCED'
          })
        ]
      })
      // .then(bundle => {
      //   const { code } = bundle.generate({
      //     format: 'umd',
      //     name: 'sum'
      //   })
      // })
    })
  })

  it('should compile with sourcemaps', () => {
    return rollup({
      input: 'example/shouldwork.js',
      plugins: [closureCompile()]
    }).then(bundle => {
      const { map } = bundle.generate({
        format: 'umd',
        name: 'sum',
        sourceMap: true
      })

      assert.ok(map, 'has a source map')
      assert.ok(Array.isArray(map.sources), 'source map has sources array')
      assert.strict.equal(map.sources.length, 2, 'source map has two sources')
      assert.ok(Array.isArray(map.names), 'source maps has names array')
      assert.ok(map.mappings, 'source map has mappings')
    })
  })
})
*/

async function build () {
  // create a bundle
  const bundle = await rollup.rollup({
    input: 'example/shouldwork.js',
    plugins: [closureCompile()]
  })

  // generate code
  const { output } = await bundle.generate({
    format: 'umd',
    name: 'sum'
  })

  var compiledCode = readFileSync(
    'example/expected/sum.min.js',
    'utf-8'
  )
  console.log(JSON.stringify(output))
  assert.strict.equal(output[0].code, compiledCode)

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isAsset) {
      // For assets, this contains
      // {
      //   isAsset: true,                 // signifies that this is an asset
      //   fileName: string,              // the asset file name
      //   source: string | Buffer        // the asset source
      // }
      console.log('Asset', chunkOrAsset)
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code

      // }
      console.log('Chunk', chunkOrAsset.modules)
    }
  }
}

build()
