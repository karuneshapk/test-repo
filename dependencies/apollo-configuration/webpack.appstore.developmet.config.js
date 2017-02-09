const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))

module.exports = (new Config()).extend(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/base.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/common.entry.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/module.entry.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/preLoaders.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/loaders.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/proxy.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/devServer.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/base.plugins.js')
).merge({
  filename: __filename,
  'debug': true
})
