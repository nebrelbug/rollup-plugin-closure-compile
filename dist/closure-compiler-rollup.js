(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.sum = {}));
}(this, function (exports) { 'use strict';

  /*
  Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
  */
  var chalk = require('chalk');

  function loopMsgs (arr, color) {
    function logMsg (msg) {
      console.log(chalk[color](msg));
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
          for (var property in flags) {
            newFlags[property] = flags[property];
          }
        }

        flags.src = code;

        var newCompiler = new ClosureCompiler({
          compilation_level: flags.level
        });

        var compilerProcess = newCompiler.run([flags], function (
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

  function nonAsync (flags) {
    return {
      name: 'closure-compile',
      renderChunk: function (code, ChunkInfo) {
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
          for (var property in flags) {
            newFlags[property] = flags[property];
          }
        }

        flags.src = code;

        var newCompiler = new ClosureCompiler({
          compilation_level: flags.level
        });

        var compilerProcess = newCompiler.run([flags], function (
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

  exports.default = closureIt;
  exports.nonAsync = nonAsync;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=closure-compiler-rollup.js.map
