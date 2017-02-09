const path = require('path')
const fs = require('fs')
require('dotenv').load({silent: true, path: path.resolve('./', '.env')})

/**
 * Configuration setup function
 * @param {Object} config
 * @param {Object} env - ENV object from process.env
 * @return {function(string, *):*}
 */
exports.configuration = (config, env) => {
  if (typeof env === 'undefined') {
    env = process.env
  }

  return function (name, defaultValue) {
    var value

    if (env[name] !== undefined) {
      value = env[name]
    } else if (config[name] !== undefined) {
      value = config[name]
    } else {
      value = defaultValue
    }

    env[name] = value

    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}

/**
 * Get allowed language codes form locales file paths
 *
 * @param {Array} locales - Array of locales paths
 * @return {Array}
 */
exports.getAllowedLocales = locales =>
  locales.map(function(locale) {
    return path.basename(locale, '-messages.json')
  })

/**
 * File exist helper
 *
 * @param {string} path
 * @return {boolean}
 */
exports.fileExist = path => {
  try {
    const stats = fs.statSync(path)
    return stats.isFile()
  } catch (e) {
    return false
  }
}

/**
 * Get build config for project
 *
 * @return {Object}
 */
exports.getBuildConfig = () => {
  const buildConfigPath = path.resolve('./', 'build.config.js')
  try {
    return require(buildConfigPath)
  } catch (e) {
    return {}
  }
}

/**
 * Find module name from module path
 *
 * @param {string} modulePath
 * @return {string}
 */
exports.findModuleName = modulePath => {
  var name = ''
  const dirname = path.dirname(String(modulePath))
  try {
    name = require(path.join(dirname, '..', 'package.json')).name
  } catch (e) {
    name = dirname.split('/').pop()
  }

  return name.replace(/^.*module-(.*)$/g, '$1').replace(/\-/g, '_')
}

/**
 * Return real path by path
 *
 * @param {string} path
 * @return {string}
 */
exports.realPath = path => {
  try {
    return fs.realpathSync(path)
  } catch (e) {
    return path
  }
}

/**
 * Return real path by paths
 *
 * @param {Array} paths
 * @return {Array}
 */
exports.realPaths = paths =>
  paths.map(path => {
    return exports.realPath(path)
  })

/**
 * Get version from package.json
 *
 * @param {string} path - Path to package.json
 * @return {string}
 */
exports.getVersion = path => {
  var version
  try {
    const json = require(path)
    version = `${json.version}#${json.gitHead}`
  } catch (e) {
    version = ''
  }
  return version
}

/**
 * Convert glob paths to webpack loader include path
 *
 * @param {Array} paths
 * @return {Array}
 */
exports.convertPathsToIncludePath = paths =>
  paths.map(p =>  path.dirname(p))

/**
 * Configure getConfig function
 * Use project package.json env or empty object
 *
 * @param {string} name Name of config key
 * @param {*} defaultValue If no find return value
 * @return {*}
 */
exports.getConfig = exports.configuration(exports.getBuildConfig())

/**
 * Make dir recursive
 *
 * @param {string} dirPath Absolute path to dir
 * @param {string} mode Rights code for dir
 */
exports.mkdirRecursive = (dirPath, mode) => {

  var testedPath = '/'

  const splitDirPath = dirPath.split(path.sep)

  splitDirPath.forEach(pathPart => {
    testedPath = path.join(testedPath, pathPart)
    try {
      fs.lstatSync(testedPath)
    } catch(err) {
      fs.mkdirSync(testedPath, mode)
    }
  })
}
