(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.sum = factory());
}(this, function () { 'use strict';

  /*
  Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
  */
  var chalk = require('chalk');

  function loopMsgs(arr, color) {
    function logMsg(msg) {
      console.log(chalk[color](msg));
    }
    arr.forEach(function(msg) {
      if (!msg.file && (msg.lineNo < 0 || !msg.lineNo)) {
        logMsg(msg.type);
      } else {
        logMsg(msg.file + ':' + msg.lineNo + ' (' + msg.type + ')');
      }
      logMsg(msg.description);
    });
  }

  function logger(output) {
    loopMsgs(output.warnings, 'orange');
    loopMsgs(output.errors, 'red');

    return output.errors.length > 0
  }

  // loopMsgs(
  //   [
  //     { type: 'ReferenceError', description: 'SomeError' },
  //     {
  //       type: 'ReferenceError',
  //       description: 'SomeError',
  //       lineNo: 30,
  //       file: 'index.js'
  //     }
  //   ],
  //   'red'
  // )

  const ClosureCompiler = require('google-closure-compiler').jsCompiler;

  function closure(flags) {
    return {
      name: 'closure-compiler-new',
      renderChunk(code, ChunkInfo) {
        var output;
        var fileName = ChunkInfo.fileName;
        var originalSourceMap = ChunkInfo.map;
        if (!flags) {
          flags = {};
        }
        flags = Object.assign(
          {
            createSourceMap: true,
            processCommonJsModules: true,
            sourceMap: originalSourceMap,
            path: fileName // This may break stuff, not sure
          },
          flags
        );
        flags.src = code;

        var newCompiler = new ClosureCompiler({
          compilation_level: flags.level
        });

        var compilerProcess = closureCompiler.run(
          [flags],
          (exitCode, stdOut, stdErr) => {
            console.log(stdOut.compiledCode);
            output = stdOut;
            //compilation complete
          }
        );

        if (logger(output)) {
          throw new Error(
            `compilation error, ${output.errors.length} error${
            output.errors.length === 0 || output.errors.length > 1 ? 's' : ''
          }`
          )
        }
        return { code: output.compiledCode, map: output.sourceMap }
      }
    }
  }

  return closure;

}));
//# sourceMappingURL=closure-compiler-rollup.js.map
