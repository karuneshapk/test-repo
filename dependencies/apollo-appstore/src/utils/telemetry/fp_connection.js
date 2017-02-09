/* This function detects the connection type */
//Works in Tor
export default () => {
  return new Promise(resolve => {
    try {
      // Deal with vendor prefixes
      var connection = window.navigator.connection || window.navigator.mozConnection
      resolve({
        'connection': connection.type
      })
    } catch (err) {
      resolve({
        'connection': null
      })
    }
  })
}
