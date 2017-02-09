/* global __DEV__ */
// import extendedTransit from 'apollo-library/utils/extendedTransit'
import { prefixedRelativeUrl } from 'apollo-library/utils/common'

var globalInstalled = false
const appHistory = []


//TODO add error sink provider based on kind of error that has happened
// e.g. api error, script error, network error...

const report = function(e) {
  if (__DEV__) {
    if (e instanceof Error || e instanceof ErrorEvent) {
      if (e.message) {
        //FIXME try to catch __currentElement of null in development and reload
      }
    }
    console.error(e) // eslint-disable-line no-console
    return true
  } else {
    try {
      let payload;

      if (e instanceof Error || e instanceof ErrorEvent) {
        payload = JSON.stringify({  // TODO in future better stacktrace serialization
          'category': 'appstore_crash_report',
          'level': 'error',
          'data': JSON.stringify(e, [
            'message',
            'arguments',
            'type',
            'name'
          ]),
//          appHistory: extendedTransit.toJSON(appHistory)
        })
      } else {
        payload = JSON.stringify({  // TODO in future better stacktrace serialization
          'category': 'appstore_api_error',
          'level': 'error', // warning maybe
          'data': typeof e === 'string' ? e : JSON.stringify(e),
//          appHistory: extendedTransit.toJSON(appHistory)
        })
      }

      return fetch(prefixedRelativeUrl('/api/log'), {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: payload
      }).then(() => {}).catch(() => {})
    } catch (x) {
      console.error(x) // eslint-disable-line no-console
    }

    if (e instanceof Error || e instanceof ErrorEvent) {
      e.stopPropagation()
      e.preventDefault()
    }
    return false
  }
}

/**
 * try catch decorator, promise aware crash reporter, rethrows exception
 *
 * @param {function} fn - function to be decorated
 *
 * @returns {function} decorated function
 */
export function handleErrors(fn) {
  return function() {
    try {
      const thing = fn.apply(this, arguments)

      if (typeof thing.then === 'function') {
        thing.catch(e => {
          report(e)
          return Promise.reject(e)
        })
      }
      return thing
    } catch (e) {
      if (report(e)) {
        throw e
      }
    }
  }
}

/**
 * Install global error listener
 */
export function installGlobalErrorHandler() {
  if (globalInstalled) {
    return
  }

  globalInstalled = true

  window.addEventListener('error', e => {
    try {
      if (report(e)) {
        throw e
      }
    } catch (x) {
      /**
       * Don't allow for infinitely recursively unhandled errors
       */
      return true
    }
  }, false)

}

/**
 * Expose error reporter
 */
export const reportError = report

/**
 * Expose middleware to remember the action and the state
 * We save last ten states and actions so we can log them to the server
 * if an error happens
 *
 * @param {Object} store
 *
 * @returns {function}
 */
export const errorLoggerMiddleware = store => next => action => {
  appHistory.unshift({
    state: store.getState(),
    action
  })

  if (appHistory.length > 50) {
    appHistory.pop()
  }

  if (appHistory.length > 2) {
    delete appHistory[2].state
  }

  return next(action)
}
