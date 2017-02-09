/* global __APP_NAME_SHORT__ */
import { generateKey, hash } from 'apollo-library/utils/math'
import { isDefined, isNil } from 'apollo-library/utils/common'

import xorshift from 'xorshift'

import _browser from './telemetry/fp_browser'
import _canvas from './telemetry/fp_canvas'
import _webgl from './telemetry/fp_webgl'
import _cookie from './telemetry/fp_cookie'
import _fonts from './telemetry/fp_fonts'
import _font_smoothing from './telemetry/fp_fontsmoothing'
import _formfields from './telemetry/fp_formfields'
import _java from './telemetry/fp_java'
import _sound from './telemetry/fp_sound'
import _os from './telemetry/fp_os'
import _gpu from './telemetry/fp_gpu'
import _timezone from './telemetry/fp_timezone'

//refactor to use https://amiunique.org/fp

// volatile

//@ not perfect, order does change
//import _plugins from './telemetry/fp_plugins'

//import _useragent from './telemetry/fp_useragent'
//import _display from './telemetry/fp_display'

//@info on Mac OSX Mighty mouse disconecting
//import _touch from './telemetry/fp_touch'

//@info Volatile changing from WIFI to 3G for example
//import _connection from './telemetry/fp_connection'

const DNT = isDefined(navigator) && navigator.doNotTrack

/*
number of cpu cores -> navigator.hardwareConcurrency
*/

/*
resolution lie
getHasLiedResolution: function(){
      if(screen.width < screen.availWidth){
        return true;
      }
      if(screen.height < screen.availHeight){
        return true;
      }
      return false;
    }
*/

var deviceFingerprint = undefined

var getFingerprint = () => deviceFingerprint

var calculateFingerprint = () => {
  if (!isNil(deviceFingerprint)) {
    return Promise.resolve(deviceFingerprint)
  }

  return Promise.all([
    _browser(),
    _canvas(),
    _webgl(),
    _cookie(),
    _fonts(),
    _timezone(),
    _font_smoothing(),
    _formfields(),
    _java(),
    _os(),
    _sound(),
    _gpu()
  ]).then(result => {
    var meta = {}
    result.forEach(item => {
      meta = {
        ...meta,
        ...item
      }
    })

    const knownOrUnknown = e => (e === null)
      ? 'unknown' : e

    const trueOrFalse = e => (e === null)
      ? 'unknown' : (e ? 'true' : 'false')

    const listOrUnknown = e => (e === null)
      ? 'unknown' : (e.length ? e.join('~') : 'unknown')

    const signature = '' +
      trueOrFalse(meta.antialias) +
      knownOrUnknown(meta.browser) +
      knownOrUnknown(meta.canvas) +
      trueOrFalse(meta.cookie) +
      listOrUnknown(meta.fonts) +
      knownOrUnknown(meta.form) +
      knownOrUnknown(meta.gpu) +
      trueOrFalse(meta.java) +
      knownOrUnknown(meta.os) +
      knownOrUnknown(meta.timezone) +
      listOrUnknown(meta.sound.probe) +
      (meta.sound.props ? JSON.stringify(meta.sound.props) : 'unknown') +
      listOrUnknown(meta.webgl)

    const hashed = String(hash(signature, 31))

    const checksum = str => {
      if (!str.length) {
        return 0
      }
      var v = 0x811c9dc5
      for (let i = 0; i < str.length; i++) {
        v = v ^ str.charCodeAt(i) & 0xFF
        v += (v << 1) + (v << 4) + (v << 7) + (v << 8) + (v << 24)
      }
      return v >>> 0
    }

    deviceFingerprint = `${hashed}.${checksum(hashed)}`
    return Promise.resolve(deviceFingerprint)
  }, () => {})
}

if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(window.name)) { // eslint-disable-line max-len
  // generate tab id
  window.name = generateKey()
}

window.setTimeout(() => {
  // lazy patch bitshift PRNG with xorshift PRNG (faster and more secure one)
  Math.random = () => xorshift.random()
}, 2000)

export default {
  getFingerprint,
  calculateFingerprint,
  DoNotTrack: DNT,
  SessionID: window.name,
  BalancingID: `${__APP_NAME_SHORT__}:${window.name}`
}

