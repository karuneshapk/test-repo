// based on user gits of http://stackoverflow.com/users/80860/kennebec
/* This function returns the browser and version number */
//Works in Tor
export default () => {
  return new Promise(function(resolve) {
    try {
      var ua = navigator.userAgent
      var tem
      var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
      if (/trident/i.test(M[1])) {
        tem =  /\brv[ :]+(\d+)/g.exec(ua) || []
        resolve({
          browser: 'IE ' + (tem[1] || '')
        })
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) {
          resolve({
            browser: tem.slice(1).join(' ').replace('OPR', 'Opera')
          })
        }
      }
      M = M[2]
        ? [M[1], M[2]]
        : [navigator.appName, navigator.appVersion, '-?']
      if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1])
      }
      resolve({
        'browser': M.join(' ')
      })
    } catch (err) {
      resolve({
        'browser': null
      })
    }
  })
}
