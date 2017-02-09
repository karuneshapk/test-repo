import { isDefined, isNil } from 'apollo-library/utils/common'

//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    try {
      // system
      var os = null
      var version = ''
      var ua = window.navigator.userAgent

      const clientStrings = [
        { s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/ },
        { s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/ },
        { s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/ },
        { s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/ },
        { s:'Windows Vista', r:/Windows NT 6.0/ },
        { s:'Windows Server 2003', r:/Windows NT 5.2/ },
        { s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/ },
        { s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/ },
        { s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/ },
        { s:'Windows 98', r:/(Windows 98|Win98)/ },
        { s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/ },
        { s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
        { s:'Windows CE', r:/Windows CE/ },
        { s:'Windows 3.11', r:/Win16/ },
        { s:'Android', r:/Android/ },
        { s:'Open BSD', r:/OpenBSD/ },
        { s:'Sun OS', r:/SunOS/ },
        { s:'Linux', r:/(Linux|X11)/ },
        { s:'iOS', r:/(iPhone|iPad|iPod)/ },
        { s:'Mac OS X', r:/Mac OS X/ },
        { s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s:'QNX', r:/QNX/ },
        { s:'UNIX', r:/UNIX/ },
        { s:'BeOS', r:/BeOS/ },
        { s:'OS/2', r:/OS\/2/ },
        { s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ } // eslint-disable-line max-len
      ]

      for (var id in clientStrings) {
        var cs = clientStrings[id]
        if (cs.r.test(ua)) {
          os = cs.s
          break
        }
      }

      if (/Windows/.test(os)) {
        version = /Windows (.*)/.exec(os)[1]
        if (version) {
          version = ' ' + version
        }
        os = 'Windows'
      }

      switch (os) {

        case 'Mac OS X': {
          version = /Mac OS X (10[\.\_\d]+)/.exec(ua)[1]
          if (version) {
            version = ' ' + version
          }
          break
        }

        case 'Android': {
          version = /Android ([\.\_\d]+)/.exec(ua)[1]
          if (version) {
            version = ' ' + version
          }
          break
        }

        case 'iOS': {
          version = /OS (\d+)_(\d+)_?(\d+)?/.exec(window.navigator.appVersion)
          version = version[1] + '.' + version[2] + '.' + (version[3] | 0)
          if (version) {
            version = ' ' + version
          }
          break
        }
      }

      var bits

      try {
        var p = window.navigator.platform
        var u = window.navigator.userAgent.toLowerCase().indexOf.bind(
          window.navigator.userAgent.toLowerCase().indexOf
        )

        bits = u('x86_64') > -1
          || u('x86-64') > -1
          || u('Win64') > -1
          || u('x64;') > -1
          || u('amd64') > -1
          || u('wow64') > -1
          || u('x64_64') > -1
          || 'MacIntel' === p
          || 'Linux x86_64' === p
            ? '64'
            : 'Linux armv7l' === p
              || 'iPad' === p
              || 'iPhone' === p
              || 'Android' === p
              || 'iPod' === p
              || 'BlackBerry' === p
                ? 'mobile'
                : 'Linux i686' === p
                  ? undefined
                  : '32'
      } catch (err) {
        /* pass */
      }

      if (isNil(bits)) {
        switch ('' + Math.tan('-1e300')) {
          case '-1.4214488238747245': {
            if (isNil(os)) {
              os = 'Linux'
            }
            bits = '64'
            break
          }
          case '0.8831488831618285': {
            if (isNil(os)) {
              os = 'Linux'
            }
            bits = '32'
            break
          }
          case '-4.987183803371025': {
            if (isNil(os)) {
              os = 'Window'
            }
            bits = '32'
            break
          }
          default: {
            os = 'Mac OS X'
            bits = '32'
            break
          }
        }
      }

      resolve({
        'os': `${os}${version} ${bits} bits`
      })
    } catch (err) {
      resolve({
        'os': 'unknown'
      })
    }
  })
}
