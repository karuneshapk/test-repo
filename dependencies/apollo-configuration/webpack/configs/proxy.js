const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')
const url = require('url')

const context = settings.PROXY_PREFIXES.map(proxy => {
  return path.join(settings.PUBLIC_PATH, proxy, '**')
})

module.exports = (new Config()).merge({
  filename: __filename,
  devServer: {
    proxy: [
      {
        context,
        target: settings.PROXY_TARGET,
        prependPath: false,
        secure: false,
        bypass: (req, res, proxyOptions) => {
          console.log(url.resolve(proxyOptions.target, req.url))
          return false
        }
      }
    ]
  }
})
