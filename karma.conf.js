'use strict'

module.exports = function(config) {

  const path = require('path')
  const webpackConfig = require(path.resolve(__dirname, 'webpack.config.js'))
  const Webpack = require('webpack')

  const TESTS_FILE_PATH = 'tests.webpack.js'

  // remove CommonsChunkPlugin - not working with karma-webpack
  webpackConfig.plugins = webpackConfig.plugins.filter((value) => {
    return !(value instanceof Webpack.optimize.CommonsChunkPlugin)
  })
  webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin())

  /* update webpack configuration */
  webpackConfig.entry = {}
  webpackConfig.DEV = true
  webpackConfig.devtool = 'inline-source-map'
  webpackConfig['module']['loaders'].push({
    test: /\.js$/,
    loader: 'babel',
    exclude: path.resolve(__dirname, 'node_modules'),
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
  })
  webpackConfig.resolve.alias.sinon = 'sinon/pkg/sinon' // https://github.com/webpack/webpack/issues/177#issuecomment-185718237
  webpackConfig.devServer.noInfo = true
  webpackConfig.externals = {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }

  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    client: {
      captureConsole: true,
      mocha: {
        bail: true
      }
    },
    autoWatch: true,
    plugins: [
      'karma-*'
    ],
    notifyReporter: {
      reportEachFailure: true, // Default: false, Will notify on every failed sepc
      reportSuccess: false // Default: true, Will notify when a suite was successful
    },
    browsers: ['jsdom'],
    singleRun: true,
    autoWatchBatchDelay: 300,
    files: [TESTS_FILE_PATH],
    preprocessors: {
      [TESTS_FILE_PATH]: ['webpack', 'sourcemap']
    },
    mochaReporter: {
      showDiff: true,
      output: 'autoWatch'
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      lazy: false,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    },
    concurrency: Infinity,
    proxyValidateSSL: false
  })
}
