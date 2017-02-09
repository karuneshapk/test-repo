/*
This function returns True if cookies are enabled or False if cookies are disabled.
*/
//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    try {
      if (('navigator' in window) && ('cookieEnabled' in window.navigator)) {
        resolve({
          'cookie': window.navigator.cookieEnabled
        })
      } else {
        resolve({
          'cookie': false
        })
      }
    } catch (err) {
      resolve({
        'cookie': false
      })
    }
  })
}
