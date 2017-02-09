const path = require('path')
const url = require('url')
const fs = require('fs')
const webpack = require('webpack')

const Config = require('webpack-config').Config
const settings = require('../../constants/settings')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const BuildLocalesPlugin = require(
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/plugins/LocalesPlugin.js')
)

const ProxyTargetUrl = url.parse(settings.PROXY_TARGET)
var plugins = [
  new CleanWebpackPlugin(['dist', 'deps', 'build', 'tmp/*', '.source-messages'], {
    root: settings.ROOT_PATH, // An absolute path for the root.
    verbose: false, // Write logs to console.
    dry: false, // Do not delete anything, good for testing.
  }),
  new webpack.EnvironmentPlugin([
    'NODE_ENV',
    'PUBLIC_PATH',
    'MODULE_PATH',
    'BUILD_NUMBER'
  ]),
  new webpack.DefinePlugin({
    __CACHE_BUST__: JSON.stringify(`?${settings.CACHE_BUST}`),
    __DEV__: JSON.stringify(settings.DEVELOPMENT),
    __DEVTOOLS__: JSON.stringify(settings.DEVTOOLS),
    __LOGGER__: JSON.stringify(settings.LOGGER),
    __COMPANY_NAME__: `"${settings.APP_COMPANY}"`,
    __APP_NAME__: `"${settings.APP_NAME}"`,
    __APP_NAME_SHORT__: `"${settings.APP_NAME_SHORT}"`,
    __MODULE_PATH__: `"${settings.MODULE_PATH}"`, // DEPRICATED
    // __APP_FAVICON__ Moved to FaviconsWebpackPlugin.
    __APP_FAVICON__: JSON.stringify(''), // `"${settings.APP_FAVICON}"`
    __BACKEND__: JSON.stringify(ProxyTargetUrl.hostname),
    /* apollo-library specific webpack constants */
    '__APP_LOGO__': false, // DEPRICATED @todo Rewrite header component in library
    /* @see http://www.metamodpro.com/browser-language-codes */
    __FALLBACK_LANGUAGE__: false,// DEPRICATED @todo Remove constants and use constants in library
    __ALLOWED_LANGUAGES__: false // DEPRICATED @todo Remove constants and use constants in library
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  }),
  new webpack.ProvidePlugin({
    'Promise': 'bluebird',
    'fetch': 'exports?self.fetch!whatwg-fetch'
  }),
  new HtmlWebpackPlugin({
    title: settings.APP_TITLE,
    cache: true,
    filename: path.join(settings.APP_BUILD_PATH, 'index.html'),
    template: (() => {
      const appIndex = path.resolve(settings.APP_SRC_PATH, 'index.html')
      const libraryIndex = path.resolve(settings.APOLLO_LIBRARY_SRC_PATH, 'index.html')
      var isFile = false

      try {
        const stats = fs.statSync(appIndex)
        isFile = stats.isFile()
      } catch (e) {
        isFile = false
      }

      return (isFile ? appIndex : libraryIndex)
    })(),
    inject: 'body',
    alwaysWriteToDisk: true,
    versions: {
      buildNumber: settings.BUILD_NUMBER,
      app: settings.APP_VERSION,
      library: settings.LIBRARY_VERSION,
      appstore: settings.APPSTORE_VERSION,
      configuration: settings.CONFIGURATION_VERSION,
      buildDate: (new Date()).toString()
    },
    chunks: [
      'common',
      'main'
    ]
  }),
  new AddAssetHtmlPlugin({
    filepath: path.join(settings.LIBRARY_DLL_PATH, 'vendor.dll.js'),
    hash: true,
  }),
  new HtmlWebpackHarddiskPlugin(),
  new BuildLocalesPlugin(
    '/locale',
    settings.APP_LOCALES,
    settings.APP_SOURCE_MESSAGES_PATH
  )
]

if (settings.APP_FAVICON !== '') {
  plugins.push(
    new FaviconsWebpackPlugin(settings.APP_FAVICON)
  )
}

module.exports = (new Config()).merge({
  filename: __filename,
  plugins
})
