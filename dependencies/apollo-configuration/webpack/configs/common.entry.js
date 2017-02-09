const Config = require('webpack-config').Config

module.exports = (new Config()).merge({
  filename: __filename,
  entry: {
    common: 'babel-polyfill'
  }
})
