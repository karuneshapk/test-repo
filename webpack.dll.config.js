const path = require('path')
const settings = require('@apollo/configuration/constants/settings')

const Config = require('webpack-config').Config

const webpackConfig = (new Config()).extend(
  path.resolve(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.dll.config.js'))

module.exports = webpackConfig
