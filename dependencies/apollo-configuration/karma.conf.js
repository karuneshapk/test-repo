const Config = require('webpack-config').Config

module.exports = (new Config()).merge({
  filename: __filename,
  basePath: '',
  frameworks: ['mocha', 'sinon'],
  reporters: ['mocha'],
  port: 9876,
  colors: true,
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
  files: ['test/tests.webpack.js'],
  // files: glob.sync('test/**/*.spec.js'),
  // files: ['test/components/UI/Alert.spec.js'],
  preprocessors: {
    'test/tests.webpack.js': ['webpack'],
    'src/**/*.js': ['webpack'],
    'src/**/*.jsx': ['webpack'],
  },
  mochaReporter: {
    showDiff: true,
    output: 'autoWatch'
  },
  webpackMiddleware: {
    noInfo: true
  },
  webpackServer: {
    noInfo: true
  },
  concurrency: Infinity,
  proxyValidateSSL: false
})
