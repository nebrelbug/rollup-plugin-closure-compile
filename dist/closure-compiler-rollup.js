(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.sum = factory());
}(this, function () { 'use strict';

  /*
  Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
  */
  var colors = {
    red: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[31m',
    yellow: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[33m',
    normal: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[0m'
  };

  function loopMsgs (arr, color) {
    function logMsg (msg) {
      console.log(colors[color] + msg + colors.normal);
    }
    arr.forEach(function (msg) {
      if (!msg.file && (msg.lineNo < 0 || !msg.lineNo)) {
        logMsg(msg.type);
      } else {
        logMsg(msg.file + ':' + msg.lineNo + ' (' + msg.type + ')');
      }
      logMsg('    ' + msg.description);
    });
  }

  function logger (output) {
    if (output.warnings && Array.isArray(output.warnings)) {
      loopMsgs(output.warnings, 'yellow');
    }
    if (output.errors && Array.isArray(output.errors)) {
      console.log(JSON.stringify(output.errors));

      loopMsgs(output.errors, 'red');
      return output.errors.length > 0
    } else {
      return false
    }
  }

  const ClosureCompiler = require('google-closure-compiler').jsCompiler;

  function closureIt (flags) {
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
        };
        if (flags && flags === Object(flags)) {
          for (var prop in flags) {
            if (flags.hasOwnProperty(prop)) {
              newFlags[prop] = flags[prop];
            }
          }
        }

        newFlags.src = code;

        var newCompiler = new ClosureCompiler({
          compilation_level:
            newFlags.level ||
            newFlags.compilation_level ||
            newFlags.compilationLevel
        });

        var compilerProcess = newCompiler.run([newFlags], function (
          exitCode,
          stdOut,
          stdErr
        ) {});
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

  return closureIt;

}));
//# sourceMappingURL=closure-compiler-rollup.js.map
