const path = require('path')
const Config = require('webpack-config').Config
const settings = require(path.resolve(__dirname, 'constants/settings'))

const TESTS_PATH = path.resolve(settings.ROOT_PATH, 'test/') // TODO dat do settings constant

module.exports = (new Config()).extend(
  {
    [path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack.appstore.developmet.config.js')]:
      config => {
        delete config.debug
        delete config.devtool
        delete config.devServer
        delete config.output.pathinfo
        delete config.entry

        config.module.loaders =
          config.module.loaders.filter(item => {
            switch (item.name) {
              case 'hot':
                return false
              case 'locale':
                return false
              default:
                return true
            }
          })

        config.plugins =
          config.plugins.filter(item => {
            switch (item.constructor.name) {
              case 'CommonsChunkPlugin':
                return false
              default:
                return true
            }
          })
        return config
      }
  },
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/common.entry.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/module.entry.js'),
  path.join(settings.APOLLO_CONFIGURATION_ROOT_PATH, 'webpack/configs/pula.entry.js')
).merge({
  filename: __filename,
  bail: false,
  devtool: 'inline-source-map',
  module: {
    loaders: [{
      test: /\.spec.jsx?$/,
      loader: 'babel',
      include: [TESTS_PATH],
      query: {
        presets: [
          'react',
          'es2015',
          'stage-0',
          'stage-1',
          'stage-2',
          'stage-3'
        ]
      }
    },{
      test: /\.json$/,
      loader: 'json',
    }]
  },
  externals: {
    'jsdom': 'window',
    // 'cheerio': 'window',
    'react/lib/ReactContext': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true,
    'text-encoding': 'window'
  },
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon',
      'cheerio': 'cheerio/lib/cheerio'
    },
    extensions: ['', '.js', '.jsx', '.json'],
  }
})
