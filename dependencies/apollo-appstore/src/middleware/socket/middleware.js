/* global __DEV__ */
import { isDefined, isEmptyString } from 'apollo-library/utils/common'
import { handleErrors } from 'apollo-appstore/utils/errors'
import {
  AS_SOCKET_CALL,
  AS_SOCKET_INVALID_ACTION,
  AS_CHANNEL_OPEN,
  AS_CHANNEL_OPENED,
  AS_CHANNEL_CLOSE,
  AS_CHANNEL_CLOSED,
  AS_CHANNEL_SEND,
  AS_CHANNEL_SENT
} from './constants'

const validateAction = action => {
  var validatioErrors = []
  if (isEmptyString(action.cmd)) {
    validatioErrors.push('[AS_SOCKET_CALL]: method missing')
  }

  if (isEmptyString(action.moduleName)) {
    validatioErrors.push('[AS_SOCKET_CALL]: module name missing')
  }

  return validatioErrors
}

const isValid = action => {
  var validationErrors = validateAction(action)

  if (validationErrors.length) {
    if (__DEV__) {
      console.debug(validationErrors) // eslint-disable-line no-console
    }

    return false
  }

  return true
}

/**
 * Creates redux middleware for websocket communication
 *
 * @returns {function}
 */
export const createSocketMiddleware = () => {
  var channel
  var isSynced = false

  const middleware = () => handleErrors(next => action => {
    if (action[AS_SOCKET_CALL]) {
      const socketAction = action[AS_SOCKET_CALL]

      if (!isValid(socketAction)) {
        next({
          type: AS_SOCKET_INVALID_ACTION
        })
      } else {
        var { moduleName, cmd, data } = socketAction

        switch (cmd) {

          case AS_CHANNEL_OPEN: {
            channel.send(`r|${moduleName}|${data}`)
            return next({
              type: AS_CHANNEL_OPENED,
              moduleName
            })
          }

          case AS_CHANNEL_CLOSE: {
            //TODO cannot send if closed!
            channel.send(`c|${moduleName}`)
            return next({
              type: AS_CHANNEL_CLOSED,
              moduleName
            })
          }

          case AS_CHANNEL_SEND: {
            //TODO send enabled only if channel was openned and not closed
            const serialized = (typeof data === 'object')
              ? JSON.stringify(data)
              : data

            channel.send(`m|${moduleName}|${serialized}`)

            return next({
              type: AS_CHANNEL_SENT,
              payload: data,
              moduleName
            })
          }
        }
      }
    } else {
      return next(action)
    }
  })

  middleware.syncSocket = function(socket, store) {
    if (isSynced) {
      return
    } else {
      channel = socket
      socket.subscribe(data => {
        if (isDefined(data.moduleName)) {
          store.dispatch(data)
        }
      })
      isSynced = true
    }
  }

  return middleware
}
