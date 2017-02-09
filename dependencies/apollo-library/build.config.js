const path = require('path')
const config = {
  PORT: 8888,
  APP_NAME: 'library',
  APP_NAME_SHORT: 'LB',
  APP_COMPANY: 'Finfactory',
  APP_TITLE: 'Library',
  APP_BUILD_PATH: __dirname,
  APOLLO_LIBRARY_ROOT_PATH: __dirname,
  DLL_BUILD_PATH: path.join(__dirname, 'dll', process.env.NODE_ENV)
}

module.exports = config
