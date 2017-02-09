var path = require('path');
var babel = require('babel-core')
var Promise = require('bluebird');
var UglifyJS = require('uglify-js');
var globAsync = Promise.promisify(require('glob'));
var fs = Promise.promisifyAll(require('fs-extra'));

module.exports = function(options) {
  if (options === void 0) {
    options = {}
  }

  var target = options.target;
  var files = options.files || [];
  var depsDir = path.resolve(target + '/../deps')

  if (!fs.existsSync(depsDir)) {
    fs.mkdirSync(depsDir)
  }

  return {
    default: this,
    apply: function apply(compiler) {
      var outputPath = compiler.options.output.path;
      var fileDependencies = [];

      compiler.plugin('emit', function(compilation, cb) {
        Promise.each(files, function(file) {
          return fs.statAsync(file).catch(function() {
            return null
          }).then(function() {
            return globAsync(file, {
              cwd: compiler.options.context
            }).each(function(relFileSrcParam) {
              var relFileDest = void 0
              var relFileSrc = void 0
              relFileSrc = relFileSrcParam

              var absFileSrc = path.resolve(compiler.options.context, relFileSrc)

              relFileDest = path.resolve(target + '/' + path.basename(file))

              fileDependencies.push(file)
              relFileDest = relFileDest || path.basename(relFileSrc)

              if (path.isAbsolute(relFileDest)) {
                relFileDest = path.relative(outputPath, relFileDest)
              }
              relFileDest = relFileDest.replace(/\\/g, '/')
              return fs.statAsync(absFileSrc).then(function(stat) {
                compilation.assets[relFileDest] = {
                  size: function size() {
                    return stat.size;
                  },
                  source: function source() {
                    var data = fs.readFileSync(absFileSrc)
                    var final_code
                    try {
                      final_code = UglifyJS.minify(babel.transform('var a=' + data, {
                        plugins: ['transform-es2015-arrow-functions']
                      }).code, {
                        fromString: true
                      }).code.substring(6).slice(0, -1)
                    } catch (e) {
                      final_code = data
                    }

                    var result = '(function(){return ' + final_code + '}())';

                    var compiled = eval(result)

                    var actions = Object.keys(compiled)
                    var services = {}
                    var pulaName = path.basename(file).split('.')[0]
                    var targetDeps = path.resolve(depsDir + '/' + pulaName + '.json');

                    var dependencies = {};

                    actions.forEach(function(item){
                      var element = compiled[item];
                      services[element.service] = 1;
                      dependencies[item] = {
                        service: element.service,
                        endpoint: element.endpoint,
                        method: element.method
                      }
                    })

                    fs.writeFileSync(targetDeps, JSON.stringify({
                      actions: actions,
                      services: Object.keys(services),
                      dependencies: dependencies
                    }, null, 2), { flag: 'w+' }, function(err) {
                      if (err) {
                        throw err
                      }
                    })
                    return result
                  }
                }
                return relFileDest
              })
            })
          })
        }).catch(function(err) {
          compilation.errors.push(err)
        }).finally(cb)
      })

      compiler.plugin('after-emit', function(compilation, callback) {
        var trackedFiles = compilation.fileDependencies;
        fileDependencies.forEach(function(file) {
          if (trackedFiles.indexOf(file) === -1) {
            trackedFiles.push(file)
          }
        })
        callback()
      })
    }
  }
}
