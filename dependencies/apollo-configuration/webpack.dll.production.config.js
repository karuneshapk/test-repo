const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BuildLocalesPlugin = require(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/plugins/LocalesPlugin.js')
)

module.exports = (new Config()).extend({
  [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.dll.developmet.config.js')]:
    config => {
      delete config.debug
      delete config.devtool
      delete config.output.pathinfo

      config.module.loaders =
        config.module.loaders.filter(item => {
          switch (item.name) {
            case 'hot':
              return false
            case 'locale':
              return false
            default:
              return true
          }
        })

      return config
    }
}, {
  [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/prod.plugins.js')]:
    config => {
      config.plugins = config.plugins.filter(plugin => {

        if (plugin instanceof CleanWebpackPlugin) {
          return false
        }
        if (plugin instanceof BuildLocalesPlugin) {
          return false
        }
        return true
      })
      return config
    }
}).merge({
  filename: __filename,
  bail: true,
  devtool: 'source-map'
})
