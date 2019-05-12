/*
Based on code here: https://github.com/camelaissani/rollup-plugin-closure-compiler-js/blob/master/src/index.js
*/
var colors = {
  red: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[31m',
  yellow: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[33m',
  normal: process.env.NODE_DISABLE_COLORS ? '' : '\x1b[0m'
}

function loopMsgs (arr, color) {
  function logMsg (msg) {
    console.log(colors[color] + msg + colors.normal)
  }
  arr.forEach(function (msg) {
    if (!msg.file && (msg.lineNo < 0 || !msg.lineNo)) {
      logMsg(msg.type)
    } else {
      logMsg(msg.file + ':' + msg.lineNo + ' (' + msg.type + ')')
    }
    logMsg('    ' + msg.description)
  })
}

export default function (output) {
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
