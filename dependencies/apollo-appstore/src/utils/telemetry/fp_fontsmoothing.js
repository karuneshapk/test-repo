import { isDefined } from 'apollo-library/utils/common'
/* eslint-disable max-len */
// based on http://www.useragentman.com/blog/2009/11/29/how-to-detect-font-smoothing-using-javascript/
/* eslint-enable max-len */

/* This function outputs the setting for fontsmoothing */
//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    if (isDefined(screen.fontSmoothingEnabled)) {
      resolve({
        'antialias': screen.fontSmoothingEnabled ? 'true' : 'false'
      })
    } else {
      try {
        // Create a 35x35 Canvas block.
        var canvas = document.createElement('canvas')
        canvas.width = '35'
        canvas.height = '35'
        // We must put this node into the body, otherwise
        // Safari Windows does not report correctly.
        canvas.style.display = 'none'
        var ctx = canvas.getContext('2d')

        // draw a black letter "O", 32px Arial.
        ctx.textBaseline = 'top'
        ctx.font = '32px Arial'
        ctx.fillStyle = 'black'
        ctx.strokeStyle = 'black'

        ctx.fillText('O', 0, 0)

        var alpha

        // start at (8,1) and search the canvas from left to right,
        // top to bottom to see if we can find a non-black pixel.  If
        // so we return true.
        for (let j = 8; j <= 32; j++) {
          for (let i = 1; i <= 32; i++) {
            alpha = ctx.getImageData(i, j, 1, 1).data[3]
            if (alpha !== 255 && alpha !== 0 && alpha > 180) {
              // font-smoothing must be on.
              resolve({
                'antialias': true
              })
              return
            }
          }
        }
        // didn't find any non-black pixels - return false.
        resolve({
          'antialias': false
        })
      }
      catch (ex) {
        // Something went wrong (for example, Opera cannot use the
        // canvas fillText() method.  Return null (unknown).
        resolve({
          'antialias': null
        })
      }
    }
  })
}
