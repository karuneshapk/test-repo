const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')
const webpack = require('webpack')

module.exports = (new Config()).merge({
  filename: __filename,
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.join(settings.LIBRARY_DLL_PATH, 'vendor-manifest.json')),
      context: settings.ROOT_PATH
    })
  ]
})
