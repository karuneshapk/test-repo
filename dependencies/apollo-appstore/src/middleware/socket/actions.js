import {
  AS_SOCKET_CALL,
  AS_CHANNEL_OPEN,
  AS_CHANNEL_CLOSE,
  AS_CHANNEL_SEND
} from './constants'

export const createModuleSocketAction = moduleName => (action, payload) => ({
  [AS_SOCKET_CALL]: {
    moduleName,
    ...action
  },
  payload
})

export const openChannel = (...args) => ({
  cmd: AS_CHANNEL_OPEN,
  data: args
})

export const closeChannel = () => ({
  cmd: AS_CHANNEL_CLOSE
})

export const sendChannel = data => ({
  cmd: AS_CHANNEL_SEND,
  data
})
