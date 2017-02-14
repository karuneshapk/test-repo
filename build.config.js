const config = {
  PORT: 8888,
  PROXY_TARGET: 'https://baihbjchk3.execute-api.eu-west-1.amazonaws.com',                          // domain
  APP_NAME: 'cashflow',                               // name of the app
  APP_NAME_SHORT: 'CFMT',                             // 2 letter shortname
  APP_COMPANY: 'Finfactory',                          // name of company
  APP_TITLE: 'CFMT Tool 1.0',                         // title of company
  MODULE_PATH: 'modules/${moduleName}',
  APP_FAVICON: 'assets/logo-app.svg'                  // favicon of company
}

module.exports = config
