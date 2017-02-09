/*
 * This function outputs the color depth, pixel depth and pixel ratio of the client's
 * display device
*/

//Works in Tor
export default () => {
  return new Promise(resolve => {
    try {
      const {
        screen: { colorDepth, pixelDepth },
        devicePixelRatio
      } = window

      resolve({
        'display': `${colorDepth}~${pixelDepth}~${(devicePixelRatio || 1)}`
      })
    } catch (err) {
      resolve({
        'display': null
      })
    }
  })
}
