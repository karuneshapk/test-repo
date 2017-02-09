/* global __DEV__, __BACKEND__, __LOGGER__ */

import { installGlobalErrorHandler, errorLoggerMiddleware } from 'apollo-appstore/utils/errors'
installGlobalErrorHandler()

// react
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { addLocaleData } from 'react-intl'

// redux
import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createBrowserHistory } from 'history'

import { isDefined, prefixedRelativeUrl } from 'apollo-library/utils/common'
import DevTools from 'apollo-library/containers/DevTools'
import { modalContainerReducer } from 'apollo-library/reducers/modalContainer'
import { notificationsReducer } from 'apollo-library/reducers/notifications'
import { dropdownReducer } from 'apollo-library/reducers/dropdown'
import { navigationReducer } from 'apollo-library/reducers/navigation'
import { formReducer } from 'apollo-library/reducers/form'
import { tabComponentReducer } from 'apollo-library/reducers/tab'
import {
  NAVIGATION_REDUCER,
} from 'apollo-library/constants/reducers'

import {
  getLocales,
  setLanguage,
  localeLoaded
} from './actions/localisation'
import { routerReducer as appStoreRouterReducer } from './router'
import socket from './socket'
import telemetry from './utils/telemetry'
import {
  createModuleLoader,
  moduleLoaderMiddleware
} from './modules'

import { loadMice } from './actions/modulesActions'
import { setDeviceId } from './actions/authActions'
import { apiMiddleware } from './middleware/api'
import { createAppFreezeMiddleware } from './middleware/freeze'
import { sideEffectMiddleware } from './middleware/side-effect'
import { createSocketMiddleware } from './middleware/socket'
import { createSession } from './middleware/session/middleware'
import { getToken, getTokenExpiration } from './utils/auth'

import reducers from './reducers'
import App from './App'

const DEFAULT_FALLBACK_LANGUAGE = 'en'

const appFreezeMiddleware = createAppFreezeMiddleware()
const socketMiddleware = createSocketMiddleware()
const history = createBrowserHistory()
const moduleLoader = createModuleLoader()
const session = createSession()

const reducer = combineReducers({
  modules: moduleLoader.getReducer(),
  root: reducers,
  routing: routerReducer,
  router: appStoreRouterReducer,
  platform: combineReducers({
    modal: modalContainerReducer,
    notifications: notificationsReducer,
    form: formReducer,
    tabComponent: tabComponentReducer,
    dropdown: dropdownReducer,
    [NAVIGATION_REDUCER]: navigationReducer,
  })
})

const middleware = [
  appFreezeMiddleware,
  thunk,
  session.middleware,
  sideEffectMiddleware,
  errorLoggerMiddleware,
  routerMiddleware(history),
  moduleLoaderMiddleware(moduleLoader),
  socketMiddleware,
  apiMiddleware
]

if (__LOGGER__) {
  middleware.push(logger({ collapsed: true }))
}

const composers = [
  applyMiddleware(...middleware)
]

if (__DEV__) {
  if (window.devToolsExtension) {
    composers.push(window.devToolsExtension())
  } else {
    composers.push(DevTools.instrument({ maxAge: 10 }))
  }
}

const store = compose(...composers)(createStore)(reducer)


syncHistoryWithStore(history, store)
moduleLoader.setStore(store)
session.setStore(store)

/**
 * Renders React application
 * @param {Object} config - application routes
 *
 * @returns {void}
 */
const renderApp = config =>
  render(
    <Provider store={store}>
      <App
        moduleLoader={moduleLoader}
        routes={config.routes}
        showNotifications={config.showNotifications}
      />
    </Provider>,
    (document.getElementById('app') || document.body)
  )

/**
 * Runs application
 *
 * @param {Object} config - application routes
 *
 * @returns {Promise}
 */
const run = config => {
  telemetry.calculateFingerprint().then(deviceId => {
    store.dispatch(setDeviceId(deviceId))
    store.dispatch(loadMice())
      .then(() => renderApp(config))
  })
}

/**
 * Loads intl polyfill in browsers that don't support intl natively
 * @returns {Promise}
 */
const loadIntlPolyfill = () => {
  // Check if polyfill required
  if (!window.Intl) {
    return new Promise(resolve => {
      require.ensure([
        'intl',
        'intl/locale-data/complete.js',
        'intl/locale-data/jsonp/en.js' // gv: required for safari
      ], function (require) {
        require('intl')
        require('intl/locale-data/complete.js')
        require('intl/locale-data/jsonp/en.js') // gv: required for safari
        resolve()
      })
    })
  } else {
    return Promise.resolve()
  }
}

/**
 * Add react intl locale data for supported langs
 *
 * @param {string} lang Language code
 */
const addReactIntlLocaleData = (lang) => {
  const localeData = require(`react-intl/locale-data/${lang}.js`)
  addLocaleData([...localeData])
}

/**
 * Add moment js locale data for supported langs
 *
 * @param {string} lang Language code
 */
const addMomentIntlLocaleData = (lang) => {
  if (lang !== 'en') {
    require(`moment/locale/${lang}.js`)
  }
}

/**
 * Loads default language and loads polyfill
 * @param {string} defaultLanguage=en - default language to set
 * @returns {Promise}
 */
const setupLanguage = (defaultLanguage = DEFAULT_FALLBACK_LANGUAGE) => {
  return loadIntlPolyfill().then(
    () => getLocales(defaultLanguage, prefixedRelativeUrl()).then(locale => {
      store.dispatch(localeLoaded(locale, defaultLanguage))
      store.dispatch(setLanguage(defaultLanguage))
      return Promise.resolve(true)
    })
  )
}

/**
 * Starts application, gets user's token,
 * checks sockets, localisation and runs application
 *
 * @param {Object} config - configuration options
 * @param {Object} config.routes - default language to use for application
 * @param {Object} [config.shared] - set application shared data
 * @param {boolean} [config.useSocket] - if application should use sockets
 * @param {string} [config.defaultLanguage=en] - default language to use for application
 */
const start = (config = {}) => {

  const {
    routes = void 0,
    useSocket = false,
    shared = false,
    languages = ['en'],
  } = config

  if (!isDefined(routes)) {
    console.error('Application has to define starting routes') // eslint-disable-line no-console
    return
  }

  const token = getToken()
  const tokenExpiration = getTokenExpiration()

  if (tokenExpiration) {
    session.startProlongTimer(tokenExpiration)
  }

  const hostName = __DEV__ ? __BACKEND__ : document.location.hostname

  if (useSocket) {
    const pullChannel = `wss://${hostName}/pull/${telemetry.SessionID}`
    // this won't work with new session data and will be rewritten
    // when sockets will be used as there will be changes
    const socketInstance = socket(pullChannel, token)

    socketMiddleware.syncSocket(socketInstance, store)
  }

  if (shared) {
    moduleLoader.setApplicationShared(config.shared)
  }

  if (languages && Array.isArray(languages)) {
    languages.forEach(language => {
      addReactIntlLocaleData(language)
      addMomentIntlLocaleData(language)
    })
  }

  setupLanguage(config.defaultLanguage).then(() => run(config))
}

export {
  store,
  start,
  moduleLoader
}
