import logger from './log'
const ClosureCompiler = require('google-closure-compiler').jsCompiler

export default function closureIt (flags) {
  return {
    name: 'closure-compile',
    renderChunk: async function (code, ChunkInfo) {
      // console.log(code)
      // console.log(JSON.stringify(ChunkInfo))
      var newFlags = {
        processCommonJsModules: true,
        path: ChunkInfo.name,
        sourceMap: ChunkInfo.map, // The original sourcemap
        fileName: ChunkInfo.name,
        level: 'SIMPLE'
      }
      if (flags && flags === Object(flags)) {
        for (var prop in flags) {
          if (flags.hasOwnProperty(prop)) {
            newFlags[prop] = flags[prop]
          }
        }
      }

      newFlags.src = code

      var newCompiler = new ClosureCompiler({
        compilation_level:
          newFlags.compilationLevel ||
          newFlags.compilation_level ||
          newFlags.level
      })

      var compilerProcess = newCompiler.run([newFlags], function (
        exitCode,
        stdOut,
        stdErr
      ) {})
      if (logger(compilerProcess)) {
        throw new Error(
          'Compilation error - ' +
            compilerProcess.errors.length +
            ' error' +
            (compilerProcess.errors.length === 1 ? '' : 's')
        )
      }
      return {
        code: compilerProcess.compiledCode,
        map: compilerProcess.sourceMap
      }
    }
  }
}

// Eventually I might add a babel plugin-builder utility as shown on the rollup-plugin-babel page
