const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')
const utils = require('../../utils/common')

const entry = {}

const modules = settings.MODULE_PATHS.concat(settings.MODULE_PATHS_NODE)

modules.forEach(module => {
  const moduleName = utils.findModuleName(module)
  const modulePath = settings.MODULE_PATH.replace('${moduleName}', moduleName)
  entry[path.join(modulePath, settings.MODULE_VERSION, 'main')] = module
})

module.exports = (new Config()).merge({
  filename: __filename,
  entry
})
