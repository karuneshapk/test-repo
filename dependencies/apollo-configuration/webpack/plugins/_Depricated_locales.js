const path = require('path')
const Promise = require('bluebird')
const globAsync = Promise.promisify(require('glob'))
const fs = Promise.promisifyAll(require('fs-extra'))
const i18 = require('i18next-conv')
const glob = require('glob-all')
const settings = require('../../constants/settings')


module.exports = function(options) {
  if (typeof options === 'undefined') {
    options = {}
  }

  var flatten = function(input, options) {
    var flat = {}
    var separator = options.keyseparator || '.'

    var recurse = function(appendTo, obj, parentKey) {

      for (var m in obj) {
        var kv = {}
        var value = obj[m]
        var context = ''
        var key = (parentKey.length > 0)
          ? (parentKey + separator + m)
          : m

        // get context if used
        var ctxKey = key
        if (key.indexOf('_plural') > -1) {
          ctxKey = ctxKey.substring(0, key.indexOf('_plural'))
          if (ctxKey.indexOf('_') > -1) {
            context = ctxKey.substring(ctxKey.lastIndexOf('_') + 1, ctxKey.length)
          }
        } else if (key.indexOf('_') > -1) {
          context = ctxKey.substring(ctxKey.lastIndexOf('_') + 1, ctxKey.length)
        } else {
          context = ''
        }

        if (context === key) {
          context = ''
        }

        if (context !== '') {
          key = key.replace('_' + context, '')
        }

        // append or recurse
        if (typeof value === 'string') {
          kv = {
            key: key,
            value: value,
            isPlural: key.indexOf('_plural') > -1,
            context: context
          }
          appendTo[kv.key + kv.context] = kv
        } else if (Object.prototype.toString.apply(value) === '[object Array]') {
          kv = {
            key: key,
            value: value.join('\n'),
            isArray: true,
            isPlural: key.indexOf('_plural') > -1,
            context: context
          }
          appendTo[kv.key + kv.context] = kv
        } else {
          recurse(appendTo, value, key)
        }
      }

    }

    recurse(flat, input, '')

    // append plurals
    for (var m in flat) {
      var kv = flat[m]

      if (kv.isPlural) {
        var parts = kv.key.split('_plural')

        var single = flat[parts[0] + kv.context]
        kv.pluralNumber = parts[1].replace('_', '')
        if (kv.pluralNumber === '') {
          kv.pluralNumber = '1'
        }

        if (single) {
          single.plurals = single.plurals || []
          single.plurals.push(kv)
          delete flat[m]
        }
      }
    }

    return flat
  }

  var normalize = function(from_source) {
    var result = {}

    for (var i in from_source) {
      if (from_source.hasOwnProperty(i)) {
        var node = from_source[i]
        result[node.id] = node.defaultMessage
      }
    }

    return result
  }

  var getextOptions = {
    quiet: true
  }

  var target = options.target
  var files = options.files || []

  return {
    default: this,
    apply: function apply(compiler) {
      var outputPath = compiler.options.output.path
      var fileDependencies = []

      compiler.plugin('emit', function(compilation, cb) {
        var sourceFiles = settings.APP_SOURCE_MESSAGES
        var buffer = []
        var remaining = sourceFiles.length
        var callback = function(err, data) {
          remaining--
          if (err) {
            throw err
          }
          buffer = buffer.concat(JSON.parse(data))
          if (!remaining) {
            var patched_json = flatten(normalize(buffer), getextOptions)
            i18.parseGettext('en', patched_json, getextOptions, function(err, data) {
              try {
                var output = data.translations['']
                for (var i in output) {
                  if (output.hasOwnProperty(i)) {
                    if (i === '') {
                      delete output[i]
                      continue
                    }
                    output[i] = output[i].msgstr
                  }
                }
                //Start generating files
                Promise.each(files, function(file) {
                  //TODO merge with PO in future
                  //var language = path.basename(file).substring(0, 2)

                  return fs.statAsync(file).catch(function() {
                    return null
                  }).then(function() {
                    return globAsync(file, {
                      cwd: compiler.options.context
                    }).each(function(relFileSrcParam) {
                      var relFileDest = undefined
                      var relFileSrc = undefined
                      relFileSrc = relFileSrcParam
                      var absFileSrc = path.resolve(compiler.options.context, relFileSrc)
                      relFileDest = path.resolve(target + '/' + path.basename(file))
                      fileDependencies.push(file)
                      compilation.fileDependencies.push(file)
                      relFileDest = relFileDest || path.basename(relFileSrc)
                      if (path.isAbsolute(relFileDest)) {
                        relFileDest = path.relative(outputPath, relFileDest)
                      }
                      relFileDest = relFileDest.replace(/\\/g, '/')
                      return fs.statAsync(absFileSrc).then(function() {
                        compilation.assets[relFileDest] = {
                          size: function size() {
                            const buf = new Buffer(JSON.stringify(output))
                            return buf.length
                          },
                          source: function source() {
                            return JSON.stringify(output)
                          }
                        }
                        return relFileDest
                      })
                    })
                  })
                }).catch(function(err) {
                  compilation.errors.push(err)
                }).finally(cb)
              } catch (e) {
                console.log('Loacales plugin error', e)
              }
            })
          }
        }

        sourceFiles.forEach(function(file) {
          fs.readFile(file, callback)
        })
        if (sourceFiles.length === 0) {
          cb()
        }
      })

    }
  }
}
