const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))

module.exports = (new Config()).extend(
  {
    [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.appstore.developmet.config.js')]:
      config => {
        delete config.debug
        delete config.devtool
        delete config.devServer
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
  },
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/prod.plugins.js')
).merge({
  filename: __filename,
  bail: true,
  devtool: 'source-map'
})
