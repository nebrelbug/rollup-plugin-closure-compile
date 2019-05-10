import logger from './log'
const ClosureCompiler = require('google-closure-compiler').jsCompiler

export default function(flags) {
  return {
    name: 'closure-compiler-new',
    renderChunk(code, ChunkInfo) {
      console.log(code)
      console.log(JSON.stringify(ChunkInfo))
      if (!flags) {
        flags = {}
      }
      flags = Object.assign(
        {
          processCommonJsModules: true,
          sourceMap: ChunkInfo.map, // The original sourcemap
          // path: ChunkInfo.facadeModuleId, // This may break stuff, not sure
          level: 'SIMPLE'
        },
        flags
      )
      flags.src = code

      var newCompiler = new ClosureCompiler({
        compilation_level: flags.level
      })

      var compilerProcess = newCompiler.run(
        [flags],
        (exitCode, stdOut, stdErr) => {

          if (stdErr) {
            logger(stdErr)
            throw new Error('Compilation error')
          }
        }
      )

      return {
        code: compilerProcess.compiledCode,
        map: compilerProcess.sourceMap
      }
    }
  }
}
