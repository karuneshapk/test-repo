const path = require('path')
const Config = require('webpack-config').Config
const autoprefixer = require('autoprefixer')
const settings = require('../../constants/settings')
const utils = require('../../utils/common');

const babelIncludes = ([
  settings.APPSTORE_SRC_PATH,
  settings.APOLLO_LIBRARY_SRC_PATH,
  settings.APP_SRC_PATH
]).concat(utils.convertPathsToIncludePath(settings.MODULE_PATHS_NODE))

module.exports = (new Config()).merge({
  filename: __filename,
  module: {
    loaders: [
      {
        name: 'hot',
        test: /\.jsx$/,
        loader: 'react-hot',
        include: babelIncludes
      },
      {
        name: 'babel',
        test: /\.jsx?$/,
        loader: 'babel',
        include: babelIncludes,
        query: {
          extends: path.resolve(settings.APOLLO_CONFIGURATION_ROOT_PATH, '.babelrc'),
          cacheDirectory: settings.DEVELOPMENT
        }
      },
      {
        name: 'css',
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        name: 'less',
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      {
        name: 'sass',
        test: /\.(sass|scss)/,
        loader: 'style!css!postcss!sass'
      },
      {
        name: 'fonts',
        test: /\.(eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      },
      {
        name: 'images',
        test: /\.(jpe?g|png|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=public/images/[name].[ext]?[hash:6]'
      },
      {
        name: 'json',
        test: /\.json$/,
        loader: 'json',
        include: [
          path.join(settings.APP_NODE_MODULES_PATH, 'moment-timezone')
        ]
      }
    ],
  },
  postcss: () => [autoprefixer]
})
