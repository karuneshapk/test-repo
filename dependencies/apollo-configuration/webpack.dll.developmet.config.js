const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

module.exports = (new Config()).extend(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/base.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/preLoaders.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/loaders.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/dll.output.js'),
  {
    [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/base.plugins.js')]:
      config => {
        config.plugins = config.plugins.filter(plugin => {

          if (plugin instanceof HtmlWebpackPlugin) {
            return false
          }
          if (plugin instanceof webpack.optimize.CommonsChunkPlugin) {
            return false
          }
          if (plugin instanceof AddAssetHtmlPlugin) {
            return false
          }
          if (plugin instanceof HtmlWebpackHarddiskPlugin) {
            return false
          }

          return true
        })

        return config
      }
  }
).merge({
  filename: __filename,
  bail: true,
  devtool: 'source-map'
})
