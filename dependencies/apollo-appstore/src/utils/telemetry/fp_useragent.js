//Works in Tor but is lying
//mozilla/5.0 (windows nt 6.1; rv:38.0) gecko/20100101 firefox/38.0|Win32|en-US
export default () => {
  return new Promise(resolve => {
    try {
      var strSep = '~'
      var strTmp = null
      var strUserAgent = null

      /* navigator.userAgent is supported by all major browsers */
      strUserAgent = navigator.userAgent.toLowerCase()
      /* navigator.platform is supported by all major browsers */
      strTmp = strUserAgent + strSep + navigator.platform
      /* navigator.cpuClass only supported in IE */
      if (navigator.cpuClass) {
        strTmp += strSep + navigator.cpuClass
      }
      /* navigator.browserLanguage only supported in IE, Safari and Chrome */
      if (navigator.browserLanguage) {
        strTmp += strSep + navigator.browserLanguage
      } else {
        strTmp += strSep + navigator.language
      }

      resolve({
        'ua': strTmp
      })
    } catch (err) {
      resolve({
        'ua': null
      })
    }
  })
}
