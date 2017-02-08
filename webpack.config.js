const path = require('path')
const settings = require('@apollo/configuration/constants/settings')

const Config = require('webpack-config').Config

const webpackConfig = (new Config()).extend(
  path.resolve(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.config.js')
).merge({
  entry: {
    main: ['bootstrap-loader', path.resolve(settings.APP_SRC_PATH, 'index.js')]
  }
})

module.exports = webpackConfig
