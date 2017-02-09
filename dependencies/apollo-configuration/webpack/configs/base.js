const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')

module.exports = (new Config()).merge({
  filename: __filename,
  output: {
    path: settings.APP_BUILD_PATH,
    publicPath: settings.PUBLIC_PATH,
    filename: '[name].js?[hash]',
    chunkFilename: '[id].chunk.js?[hash]',
    pathinfo: settings.DEVELOPMENT
  },
  module: {
    noParse: [
      /sinon|bindings/
    ]
  },
  resolve: {
    unsafeCache: false,
    root: settings.APP_SRC_PATH,
    modulesDirectories: [
      settings.APP_NODE_MODULES_PATH,
      settings.APPSTORE_SRC_PATH,
      settings.APOLLO_LIBRARY_SRC_PATH,
      './' + settings.NODE_MODULES_DIR_NAME
    ],
    extensions: ['', '.js', '.jsx', '.less', '.sass', '.scss', '.css', '.json'],
    alias: {
      'apollo-library': settings.APOLLO_LIBRARY_SRC_PATH,
      'apollo-platform': settings.APOLLO_LIBRARY_SRC_PATH,
      'apollo-appstore': settings.APPSTORE_SRC_PATH
    },
    fallback: [
      settings.APP_NODE_MODULES_PATH
    ]
  },
  resolveLoader: {
    root: settings.APP_NODE_MODULES_PATH,
    fallback: [
      path.resolve(settings.APOLLO_CONFIGURATION_ROOT_PATH, settings.NODE_MODULES_DIR_NAME)
    ]
  },
  target: 'web',
  devtool: 'eval',
  cache: settings.DEVELOPMENT,
  stats: {
    // Config for minimal console.log mess.
    assets: true,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false
  }
})
