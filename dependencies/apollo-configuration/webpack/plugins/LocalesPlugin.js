const settings = require('../../constants/settings')
const path = require('path')
const glob = require('glob-all')

/**
 * Locales Plugin
 *
 * @param {string} target Relative path from build
 * @param {Array} localeFiles List of absolute paths to default locale files
 * @param {string} sourceMessagesPath Path to where babel-intl put sourece messages
 */
function LocalesPlugin(target, localeFiles, sourceMessagesPath) {
  this.target = target
  this.localeFiles = localeFiles
  this.sourceMessagesPath = path.resolve(sourceMessagesPath)

  this.pluginEmit = this.pluginEmit.bind(this)
}

/**
 * Plugin entry point
 *
 * @param {webapck.Compiler} compiler
 */
LocalesPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', this.pluginEmit)
}

/**
 * Emit action handler
 *
 * @param {Object} compilation
 * @param {function} callback
 */
LocalesPlugin.prototype.pluginEmit = function (compilation, callback) {
  const sourceMessagesPaths = glob.sync(path.join(this.sourceMessagesPath, '**', '*.json'))
    .filter(localePath => !localePath.match(settings.SOURCE_MESSAGES_EXCLUDE_RE))

  const sourceMessages = this.readMessages(sourceMessagesPaths)

  this.localeFiles.forEach(function (localeFile) {
    const localeMessages = this.readMessage(localeFile)
    const processedMessages = this.processMessages(localeMessages, sourceMessages)

    const filename = path.basename(localeFile, '.json')
    const sourceFilename = path.join(this.target, `${filename}.source.json`)
    const mergedFilename = path.join(this.target, `${filename}.merged.source.json`)
    const localeFilename = path.join(this.target, `${filename}.json`)

    compilation.fileDependencies.push(localeFile)

    this.createCompileFile(compilation, sourceFilename, sourceMessages, true)
    this.createCompileFile(compilation, mergedFilename, processedMessages.sourceMessages, true)
    this.createCompileFile(compilation, localeFilename, processedMessages.flatMessages)
  }, this)

  callback()
}

/**
 * Multi path message reader
 *
 * @param {Array} messagesPaths
 * @return {Array} Lit of merged messages
 */
LocalesPlugin.prototype.readMessages = function (messagesPaths) {
  var messages = []
  messagesPaths.forEach(function (messagesPath) {
    messages = messages.concat(this.readMessage(messagesPath))
  }, this)

  return messages
}

/**
 * Read one message file
 *
 * @param {string} messagesPath
 * @return {Array} Lit of messages
 */
LocalesPlugin.prototype.readMessage = function (messagesPath) {
  const sourceMessages = require(path.resolve(messagesPath))

  return sourceMessages || []
}

/**
 * Process default messages and source intl messages
 *
 * @param {Array} localeMessages
 * @param {Array} sourceMessages
 * @return {Object} Inside source messages and flat messages
 */
LocalesPlugin.prototype.processMessages = function (localeMessages, sourceMessages) {
  var mergedMessages = localeMessages.concat(sourceMessages)

  return mergedMessages.reduce(function (reducer, currentMessage) {

    if (currentMessage.hasOwnProperty('id') && reducer.flatMessages[currentMessage.id] === void 0) {
      reducer.flatMessages[currentMessage.id] = currentMessage.defaultMessage
      reducer.sourceMessages.push(currentMessage)
    }

    return reducer
  }, { sourceMessages: [], flatMessages: {} })
}

/**
 * Put webpack asset
 *
 * @param {Object} compilation
 * @param {string} filename
 * @param {Array|Object} data
 * @param {boolean} pretty
 */
LocalesPlugin.prototype.createCompileFile = function(compilation, filename, data, pretty) {
  const sourceData = this.stringify(data, pretty)
  compilation.assets[filename] = {
    source: function () {
      return sourceData
    },
    size: function () {
      const buf = new Buffer(sourceData)
      return buf.length
    }
  }
}

/**
 * JSON Stringifi with pretty switch
 *
 * @param {*} data
 * @param {boolean} pretty
 * @return {string}
 */
LocalesPlugin.prototype.stringify = function (data, pretty) {
  if (pretty) {
    return JSON.stringify(data, null, '  ')
  }
  return JSON.stringify(data)
}

module.exports = LocalesPlugin
