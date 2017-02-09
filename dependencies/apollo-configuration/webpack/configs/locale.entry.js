const path = require('path')
const Config = require('webpack-config').Config
const settings = require('../../constants/settings')

const entry = {}

settings.APP_LOCALES.map(locale => {
  const loacleName = path.basename(locale, '.json')
  entry[`locale/${loacleName}`] = locale
})

module.exports = (new Config()).merge({
  filename: __filename,
  entry
})
