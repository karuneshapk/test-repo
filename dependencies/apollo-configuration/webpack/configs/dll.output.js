const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = (new Config()).merge({
  filename: __filename,
  output: {
    path: settings.DLL_BUILD_PATH,
    filename: '[name].dll.js',
    library: '[name]_[hash]_lib'
  },
  plugins: [
    new CleanWebpackPlugin([settings.DLL_BUILD_PATH], {
      root: settings.ROOT_PATH, // An absolute path for the root.
      verbose: false, // Write logs to console.
      dry: false // Do not delete anything, good for testing.
    }),
    new webpack.DllPlugin({
      path: path.join(settings.DLL_BUILD_PATH, '[name]-manifest.json'),
      name: '[name]_[hash]_lib',
      context: settings.ROOT_PATH
    })
  ]
})
