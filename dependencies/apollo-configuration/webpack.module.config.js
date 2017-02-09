const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils/common')

const libraryName = `module_${utils.findModuleName(
  path.join(settings.APP_SRC_PATH, 'index.js')
)}`

module.exports = (new Config()).extend({
  [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.config.js')]: config => {
    delete config.entry.common

    config.plugins = config.plugins.filter(plugin => {
      if (plugin instanceof HtmlWebpackPlugin) {
        return false
      }
      if (plugin instanceof webpack.optimize.CommonsChunkPlugin) {
        return false
      }

      return true
    })
    return config
  }
}).merge({
  filename: __filename,
  output: {
    path: settings.APP_BUILD_PATH,
    filename: '[name].js',
    library: libraryName
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(settings.APP_BUILD_PATH, '[name]-manifest.json'),
      name: libraryName,
      context: settings.ROOT_PATH
    })
  ]
})
