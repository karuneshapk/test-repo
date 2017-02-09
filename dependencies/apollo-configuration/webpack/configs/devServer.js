const Config = require('webpack-config').Config
const settings = require('../../constants/settings')

module.exports = (new Config()).merge({
  filename: __filename,
  devServer: {
    port: settings.PORT,
    hot: true,
    https: true,
    quiet: false,
    noInfo: false,
    contentBase: settings.APP_BUILD_PATH,
    historyApiFallback: {
      index: settings.PUBLIC_PATH
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
})
