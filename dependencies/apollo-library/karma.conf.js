const path = require('path')
const settings = require('@apollo/configuration/constants/settings')

const Config = require('webpack-config').Config

const karmaWebpackConf = (new Config()).extend(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.karma.config.js')
)

const karmaConf = (new Config()).extend(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'karma.conf.js')
).merge({
  filename: __filename,
  webpack: karmaWebpackConf
})

module.exports = (config) => {
  config.set(karmaConf)
}
