const path = require('path')
const glob = require('glob-all')
const utils = require(path.resolve(__dirname, '../utils/common'))

exports.DEVELOPMENT = (process.env.NODE_ENV === 'development')

// Dev server port
exports.PORT = utils.getConfig('PORT', 8888)

// Common list of vendors (no appolo library or appstore included)
exports.COMMON_VENDORS = [
  'babel-polyfill',
  'intl',
  'immutable',
  'react',
  'react-dom',
  'react-router',
  'redux',
  'react-redux',
  'react-router-redux',
  'redux-thunk',
  'history',
  'moment',
  'moment-timezone',
  'react-intl',
  'bluebird',
  'xorshift'
]

// Appstore configuration
exports.LOGGER = utils.getConfig('LOGGER', false)
exports.DEVTOOLS = utils.getConfig('DEVTOOLS', exports.DEVELOPMENT)
exports.CACHE_BUST = utils.getConfig('CACHE_BUST', (new Date()).getTime())

// Application configuration
exports.APP_NAME = utils.getConfig('APP_NAME', '')
exports.APP_NAME_SHORT = utils.getConfig('APP_NAME_SHORT', '??')
exports.APP_FAVICON = utils.getConfig('APP_FAVICON', '')
exports.COMPANY_NAME = utils.getConfig('COMPANY_NAME', '')
exports.APP_TITLE = utils.getConfig('APP_TITLE', 'No title setting')
exports.PUBLIC_PATH = utils.getConfig('PUBLIC_PATH', '/')
exports.PROXY_TARGET = utils.getConfig('PROXY_TARGET', '')
exports.PROXY_PREFIXES = utils.getConfig('PROXY_PREFIXES', [
  '/pull',
  '/sys',
  '/api',
  '/proxy',
])

// Application paths
exports.ROOT_PATH = path.resolve(utils.getConfig('ROOT_PATH', './'))
exports.APP_SRC_PATH = utils.getConfig('APP_SRC_PATH',
  path.join(exports.ROOT_PATH, 'src'))
exports.APP_BUILD_PATH =
  path.resolve(exports.ROOT_PATH, utils.getConfig('APP_BUILD_PATH', 'build'))
exports.DLL_BUILD_PATH = utils.getConfig('DLL_BUILD_PATH',
  path.join(exports.APP_BUILD_PATH, 'dll'))
exports.LOCALE_BUILD_PATH =
  utils.getConfig('LOCALE_PATH', path.join(exports.APP_BUILD_PATH, 'locale'))

// Application node modules paths
exports.NODE_MODULES_DIR_NAME = utils.getConfig('NODE_MODULES_DIR_NAME', 'node_modules')
exports.APOLLO_NODE_MODULES_GROUP_NAME =
  utils.getConfig('APOLLO_NODE_MODULES_GROUP_NAME', '@apollo')
exports.APP_NODE_MODULES_PATH = utils.getConfig('APP_NODE_MODULES_PATH',
  path.join(exports.ROOT_PATH, exports.NODE_MODULES_DIR_NAME))
exports.APOLLO_NODE_MODULES_PATH = utils.getConfig('APOLLO_NODE_MODULES_PATH',
  path.join(exports.APP_NODE_MODULES_PATH, exports.APOLLO_NODE_MODULES_GROUP_NAME))

// Appstore paths
exports.APPSTORE_ROOT_PATH = utils.getConfig('APPSTORE_ROOT_PATH',
  utils.realPath(
    path.resolve(exports.APOLLO_NODE_MODULES_PATH, 'appstore'
  )))
exports.APPSTORE_SRC_PATH = utils.getConfig('APPSTORE_SRC_PATH',
  path.resolve(exports.APPSTORE_ROOT_PATH, 'src'))

// Apollo library paths
exports.APOLLO_LIBRARY_ROOT_PATH = utils.getConfig('APOLLO_LIBRARY_ROOT_PATH',
  utils.realPath(
    path.resolve(exports.APOLLO_NODE_MODULES_PATH, 'library'
  )))
exports.APOLLO_LIBRARY_SRC_PATH = utils.getConfig('APOLLO_LIBRARY_SRC_PATH',
  path.resolve(exports.APOLLO_LIBRARY_ROOT_PATH, 'src'))
exports.LIBRARY_DLL_PATH = utils.getConfig('LIBRARY_DLL_PATH',
  path.join(exports.APOLLO_LIBRARY_ROOT_PATH, 'dll', process.env.NODE_ENV))

// Apollo configuration paths
exports.APOLLO_CONFIGURATION_ROOT_PATH = utils.getConfig('APOLLO_CONFIGURATION_ROOT_PATH',
  path.resolve(exports.APOLLO_NODE_MODULES_PATH, 'configuration'))

// Application locales
exports.APP_LOCALES = utils.getConfig('APP_LOCALES',
  glob.sync(path.resolve(exports.ROOT_PATH, 'locale', '**/*-messages.json')))
exports.APP_SOURCE_MESSAGES_PATH = utils.getConfig('APP_SOURCE_MESSAGES_PATH',
  path.resolve(exports.ROOT_PATH, '.source-messages'))
exports.ALLOWED_LANGUAGES = utils.getConfig('ALLOWED_LANGUAGES',
  utils.getAllowedLocales(exports.APP_LOCALES))
exports.FALLBACK_LANGUAGE = utils.getConfig('FALLBACK_LANGUAGE', exports.ALLOWED_LANGUAGES[0])

// Modules and pulas files
exports.MODULE_PREFIX = utils.getConfig('MODULE_PREFIX', 'module')
exports.MODULE_PATH = utils.getConfig('MODULE_PATH', '${moduleName}')
exports.MODULE_VERSION = utils.getConfig('MODULE_VERSION', 'latest')

exports.MODULE_PATHS_NODE = utils.realPaths(glob.sync(
  path.join(exports.APOLLO_NODE_MODULES_PATH, `${exports.MODULE_PREFIX}*`, 'src', 'index.js')))
exports.MODULE_PATHS = glob.sync(path.join(exports.APP_SRC_PATH, 'modules', '*/index.js'))

exports.PULA_PATHS_NODE = utils.realPaths(glob.sync(
  path.join(exports.APOLLO_NODE_MODULES_PATH, `${exports.MODULE_PREFIX}*`, 'src', '*.pula.js')))
exports.PULA_PATHS = glob.sync(path.join(exports.APP_SRC_PATH, 'modules', '*/*.pula.js'))

// Versions
exports.APP_VERSION =
  `${utils.getConfig('npm_package_version', null)}#${utils.getConfig('npm_package_gitHead', null)}`
exports.LIBRARY_VERSION =
  utils.getVersion(path.join(exports.APOLLO_LIBRARY_ROOT_PATH, 'package.json'))
exports.APPSTORE_VERSION =
  utils.getVersion(path.join(exports.APPSTORE_ROOT_PATH, 'package.json'))
exports.CONFIGURATION_VERSION =
  utils.getVersion(path.join(exports.APOLLO_CONFIGURATION_ROOT_PATH ,'package.json'))
exports.BUILD_NUMBER = utils.getConfig('BUILD_NUMBER', 'N/A')
exports.SOURCE_MESSAGES_EXCLUDE_RE = /node_modules\/@apollo\/module\-/
