import {
  AS_PING_CHANNEL,
  AS_AUTHORIZE_CHANNEL,
  AS_HEARTBEAT_INTERVAL,
  AS_TIMEOUT_INTERVAL,
  AS_RECONNECT_INTERVAL,
  AS_RECONNECT_TRIES,
  AS_RECONNECT_TRYAGAIN_TIMEOUT
} from 'constants/channel'
import { reportError } from 'apollo-appstore/utils/errors'
import {
  AS_SOCKET_CONNECTED,
  AS_SOCKET_CLOSED,
  AS_CHANNEL_RECEIVED,
  AS_CHANNEL_CLOSED
} from 'apollo-appstore/middleware/socket/constants'

var runsOnBackground = false

var subscriptionFascade = function() {
  var resolvers = []
  var rejectors = []

  return {
    onResolve(listener) {
      var index = resolvers.push(listener) - 1
      return {
        remove() {
          delete resolvers[index]
        }
      }
    },
    onReject(listener) {
      var index = rejectors.push(listener) - 1
      return {
        remove() {
          delete rejectors[index]
        }
      }
    },
    resolve(e) {
      if (e) {
        resolvers.forEach(function(item) {
          if (item(e)) {
            return
          }
        })
      }
    },
    reject(e) {
      if (e) {
        rejectors.forEach(function(item) {
          item(e)
        })
      }
    }
  }
}

//FIXME merge autoreconecting socket with heart-beating socket implemented below
/**
 * Automatically recconecting socket fascade
 */
function Socket() {
  var self = this
  var forceClose = false
  var timeOut = false
  var reconect = false
  var timeoutTicker = false
  var reconectTicker = false
  var raw = false
  var reconnectTry = 0

  const open = () => {
    raw = new WebSocket(arguments[0], [])

    if (reconectTicker) {
      clearTimeout(reconectTicker)
    }

    timeoutTicker = setTimeout(() => {
      timeOut = true
      if (raw) {
        raw.close()
      }
      timeOut = false
    }, AS_TIMEOUT_INTERVAL)

    raw.onopen = () => {
      if (timeoutTicker) {
        clearTimeout(timeoutTicker)
      }
      reconect = false
      reconnectTry = 0
      self.onopen()
    }
    raw.onclose = () => {
      if (timeoutTicker) {
        clearTimeout(timeoutTicker)
      }
      raw = false
      if (forceClose) {
        self.onclose()
      } else {
        if (reconect && !timeOut) {
          self.onclose()
        }
        if (reconnectTry <= AS_RECONNECT_TRIES) {
          reconnectTry++
          reconectTicker = setTimeout(() => {
            reconect = true
            open()
          }, AS_RECONNECT_INTERVAL)
        } else {
          reconnectTry = 0
          reconectTicker = setTimeout(() => {
            reconect = true
            open()
          }, AS_RECONNECT_TRYAGAIN_TIMEOUT)
        }
      }
    }
    raw.onmessage = e => self.onmessage(e)
  }

  reconect = false
  open()

  this.gracefullReopen = () => open()
  this.send = e => raw && raw.send(e)
}

Socket.prototype.onopen = function(){}
Socket.prototype.onclose = function(){}
Socket.prototype.onmessage = function(){}

export default (endpoint, credentials) => {
  const socket = new Socket(endpoint)

  const subscription = subscriptionFascade()

  var connected = 0
  var isBeating = false
  var beat = false

  const resetHeartBeatTimer = () => {
    if (beat) {
      clearTimeout(beat)
    }
    beat = false
    if (isBeating) {
      beat = setTimeout(() => {
        try {
          socket.send(AS_PING_CHANNEL)
        } catch(e) {
          //pass
        } finally {
          resetHeartBeatTimer()
        }
      }, AS_HEARTBEAT_INTERVAL)
    }
  }

  socket.onopen = () => {
    while (!connected || connected & 2) {
      try {
        if (credentials !== undefined) {
          // authorize channel with JSON Web Token
          socket.send(AS_AUTHORIZE_CHANNEL(credentials))
        } else {
          // ping
          socket.send(AS_PING_CHANNEL)
        }
        subscription.resolve({
          type: AS_SOCKET_CONNECTED
        })
        isBeating = true
        resetHeartBeatTimer()
        break
      } catch(e) {
        //FIXME link with error reporting, continue onwards
      }
    }

    connected = 2
  }

  socket.onclose = () => {
    if (connected & 1) {
      subscription.resolve({
        type: AS_SOCKET_CLOSED
      })
      isBeating = false
      if (beat) {
        clearTimeout(beat)
      }
      beat = false
    }
    connected = 1
  }

  socket.onmessage = ({ data }) => {
    switch (data) {

      case AS_PING_CHANNEL: {
        break
      }

      default: {
        var parts = (data || '').split('|')

        switch (parts[0]) {

          case 'm': {
            var result = undefined
            try {
              result = {
                type: AS_CHANNEL_RECEIVED,
                moduleName: (parts[1] || '').toUpperCase(),
                payload: JSON.parse(parts[2])
              }
            } catch (err) {
              /* ignore malformed data */
              reportError(err)
              break
            }
            if (result !== undefined) {
              subscription.resolve(result)
            }
            break
          }

          case 'c': {
            subscription.resolve({
              type: AS_CHANNEL_CLOSED,
              moduleName: (parts[1] || '').toUpperCase(),
              payload: {}
            })
            break
          }
        }
      }
    }
  }

  window.addEventListener('offline', socket.onclose)

  const onForegroundThread = () => {
    runsOnBackground = false
    if (!(connected & 2)) {
      socket.gracefullReopen()
    }
  }

  const onBackgroundThread = () => {
    runsOnBackground = true
  }

  const handleTabChange = forcedFlag => {
    if (typeof forcedFlag === 'boolean' && forcedFlag && runsOnBackground) {
      onForegroundThread()
    } else if (typeof forcedFlag === 'boolean' && !forcedFlag && !runsOnBackground) {
      onBackgroundThread()
    } else if (typeof forcedFlag !== 'boolean' && document['hidden'] && !runsOnBackground) {
      onBackgroundThread()
    } else if (typeof forcedFlag !== 'boolean' && !document['hidden'] && runsOnBackground) {
      onForegroundThread()
    }
  }

  document.addEventListener('visibilitychange', handleTabChange, false)
  document.addEventListener('focus', () => { handleTabChange(true) }, false)
  document.addEventListener('blur', () => { handleTabChange(false) }, false)
  window.addEventListener('focus', () => { handleTabChange(true) }, false)
  window.addEventListener('blur', () => { handleTabChange(false) }, false)

  return {
    subscribe: subscription.onResolve.bind(subscription),
    onError: subscription.onReject.bind(subscription),
    send: socket.send.bind(this)
  }

}
