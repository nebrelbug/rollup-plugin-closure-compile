(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.sum = factory());
}(this, function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  /*
  Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
  */
  var colors = {
    red: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[31m',
    yellow: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[33m',
    normal: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[0m'
  };

  function loopMsgs(arr, color) {
    function logMsg(msg) {
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
    if (output.warnings && Array.isArray(output.warnings) && output.warnings.length > 0) {
      loopMsgs(output.warnings, 'yellow');
    }

    if (output.errors && Array.isArray(output.errors) && output.errors.length > 0) {
      // console.log(JSON.stringify(output.errors))
      loopMsgs(output.errors, 'red');
      return true;
    } else {
      return false;
    }
  }

  var ClosureCompiler = require('google-closure-compiler').jsCompiler;

  function closureIt(flags) {
    return {
      name: 'closure-compile',
      renderChunk: function () {
        var _renderChunk = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(code, ChunkInfo) {
          var newFlags, prop, newCompiler, compilerProcess;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // console.log(code)
                  // console.log(JSON.stringify(ChunkInfo))
                  newFlags = {
                    processCommonJsModules: true,
                    path: ChunkInfo.name,
                    sourceMap: ChunkInfo.map,
                    // The original sourcemap
                    fileName: ChunkInfo.name,
                    level: 'SIMPLE'
                  };

                  if (flags && flags === Object(flags)) {
                    for (prop in flags) {
                      if (flags.hasOwnProperty(prop)) {
                        newFlags[prop] = flags[prop];
                      }
                    }
                  }

                  newFlags.src = code;
                  newCompiler = new ClosureCompiler({
                    compilation_level: newFlags.compilationLevel || newFlags.compilation_level || newFlags.level
                  });
                  compilerProcess = newCompiler.run([newFlags], function (exitCode, stdOut, stdErr) {});

                  if (!logger(compilerProcess)) {
                    _context.next = 7;
                    break;
                  }

                  throw new Error('Compilation error - ' + compilerProcess.errors.length + ' error' + (compilerProcess.errors.length === 1 ? '' : 's'));

                case 7:
                  return _context.abrupt("return", {
                    code: compilerProcess.compiledCode,
                    map: compilerProcess.sourceMap
                  });

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function renderChunk(_x, _x2) {
          return _renderChunk.apply(this, arguments);
        }

        return renderChunk;
      }()
    };
  } // Eventually I might add a babel plugin-builder utility as shown on the rollup-plugin-babel page

  return closureIt;

}));
//# sourceMappingURL=closure-compiler-rollup.js.map
