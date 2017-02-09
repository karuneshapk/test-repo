const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')
const utils = require('../../utils/common')

const entry = {}

const pulas = settings.PULA_PATHS.concat(settings.PULA_PATHS_NODE)
pulas.map(pula => {
  const pulaName = path.basename(pula, '.js')
  const moduleName = utils.findModuleName(pula)
  const modulePath = settings.MODULE_PATH.replace('${moduleName}', moduleName)
  entry[path.join(modulePath, pulaName)] = pula
})

module.exports = (new Config()).merge({
  filename: __filename,
  entry
})
