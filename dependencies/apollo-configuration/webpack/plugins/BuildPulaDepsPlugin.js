const path = require('path')
const glob = require('glob-all')

const methods = BuildPulaDepsPlugin.prototype

function BuildPulaDepsPlugin(options) {
  if(options === void 0) {
    options = {}
  }

  this.buildPath = options.buildPath
  this.depsPath = options.depsPath
  this.compilerDone = this.compilerDone.bind(this)
}

methods.apply = function apply(compiler) {
  compiler.plugin('done', this.compilerDone)
}

methods.compilerDone = function compilerDone() {
  const compiledPulsFiles = glob.sync(path.join(this.buildPath, '**/*.pula.js'))
  compiledPulsFiles.map(pulaFile => {
    const pula = require(pulaFile)
    console.log(pula);
  })
}

module.exports = BuildPulaDepsPlugin
