/* This function outputs the timezone of the client in e.g. +01:00 format */
//Works in Tor but is lying
export default () => {
  return new Promise(resolve => {
    try {
      var offset = new Date().getTimezoneOffset()
      var o = Math.abs(offset)
      var sig = (offset < 0 ? '+' : '-')
      var hrs = ('00' + Math.floor(o / 60)).slice(-2)
      var mins = ('00' + (o % 60)).slice(-2)

      resolve({ 'timezone': `${sig}${hrs}:${mins}` })
    } catch (err) {
      resolve({
        'timezone': null
      })
    }
  })
}
