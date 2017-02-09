/* This function returns 1 or 0 depending if touch capability is enabled */
export default () => {
  return new Promise(resolve => {
    try {
      if (document.createEvent('TouchEvent')) {
        resolve({
          'touch': true
        })
      } else {
        resolve({
          'touch': false
        })
      }
    } catch (err) {
      resolve({
        'touch': false
      })
    }
  })
}
