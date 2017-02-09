import moment from 'moment'
import { isDefined, isNil } from 'apollo-library/utils/common'
import { median } from 'apollo-library/utils/math'

/* parametrization constants */
const POLLUTION_THRESHOLD = 2000 // in ms
const NUMBER_OF_SAMPLES = 2
const RECONNECT_TRIES = 3
const TIME_BETWEEN_SYNC = 1000 // in ms
const TIME_BETWEEN_SYNC_TRYAGAIN = 60000 // in ms

/* package variables */
var timeDeltas = []
var syncing = false
var CURRENT_API = undefined
var reconnectTry = 0

/**
 * Emit one request for server time
 */
const syncTick = () => {
  if (isNil(CURRENT_API)) {
    return
  }

  const t0 = performance.now()

  fetch(CURRENT_API).then(response => response.ok
    ? response.text()
    : Promise.reject(new Error())
  ).catch(() => Promise.resolve(undefined)).then(time => {
    if (isDefined(time)) {
      reconnectTry = 0
      if (String(time).charAt(0) === '"') {
        //@info double wrapped string patch
        time = JSON.parse(time)
      }

      const last = timeDeltas[timeDeltas.length - 1]
      const t1 = performance.now()

      if (moment(time).isValid()) {
        const normalizedServerTime = moment.utc(time)
        const delta = normalizedServerTime.diff(moment()) - ((t1 - t0) / 2)

        //prevent pollution of average by great delta between samples
        if (isDefined(last) && Math.abs(last - delta) > POLLUTION_THRESHOLD) {
          //samples were polluted
          timeDeltas = [ delta ]
        } else {
          //samples in bounds or new
          timeDeltas.push(delta)
        }
      }
    }

    if (timeDeltas.length < NUMBER_OF_SAMPLES) {
      //aggregate values to compensate for delta differences
      if (reconnectTry <= RECONNECT_TRIES) {
        reconnectTry++
        setTimeout(syncTick, TIME_BETWEEN_SYNC)
      } else {
        reconnectTry = 0
        setTimeout(syncTick, TIME_BETWEEN_SYNC_TRYAGAIN)
      }
    } else {
      //reduce aggregated differences into single value, calculate median value
      timeDeltas = [ median(timeDeltas) ]
    }
  })
}

/**
 * Return server time if known or client time if unknown
 *
 * @return {moment}
 */
export const serverTime = () => {
  const last = timeDeltas[timeDeltas.length - 1]
  return isDefined(last)
    ? moment().add(last)
    : moment()
}

/**
 * Start synchronization with server time
 *
 * @param {string} api - url of time endpoint
 */
export const synchronizeTime = api => {
  CURRENT_API = api
  if (!syncing) {
    syncTick()
    syncing = true
  }
}
