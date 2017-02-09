const path = require('path')
const Config = require('webpack-config').Config
const environment = require('webpack-config').environment
const settings = require(path.resolve(__dirname, 'constants/settings'))

environment.setAll({
  env: () => settings.DEVELOPMENT ? 'developmet' : 'production'
})

module.exports = (new Config()).extend(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.dll.[env].config.js')
)
