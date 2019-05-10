/*
Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
*/
var chalk = require('chalk')

function loopMsgs(arr, color) {
  function logMsg(msg) {
    console.log(chalk[color](msg))
  }
  arr.forEach(function(msg) {
    if (!msg.file && (msg.lineNo < 0 || !msg.lineNo)) {
      logMsg(msg.type)
    } else {
      logMsg(msg.file + ':' + msg.lineNo + ' (' + msg.type + ')')
    }
    logMsg(msg.description)
  })
}

export default function(output) {
  console.log('++++++++++++++++++++++')
  console.log(JSON.stringify(output))

  if (output.warnings && Array.isArray(output.warnings)) {
    loopMsgs(output.warnings, 'yellow')
  }
  if (output.errors && Array.isArray(output.errors)) {
    console.log(JSON.stringify(output.errors))

    loopMsgs(output.errors, 'red')
    return output.errors.length > 0
  } else {
    return false
  }
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
