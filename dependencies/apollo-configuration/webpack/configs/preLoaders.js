const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')


module.exports = (new Config()).merge({
  filename: __filename,
  module: {
    preLoaders: [
      {
        name: 'pulas',
        test: /pula\.js$/,
        loader: path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, '/webpack/loaders/pula.js')
      }
    ]
  }
})
