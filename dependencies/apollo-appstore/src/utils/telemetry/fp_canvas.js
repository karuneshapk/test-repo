//hight entropy canvas fingerprinting
//based on https://www.browserleaks.com/canvas#how-does-it-work
//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    const strText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:\',<.>/?' // eslint-disable-line max-len
    try {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      ctx.textBaseline = 'top'
      ctx.font = '14px \'Arial\''
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText(strText, 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText(strText, 4, 17)
      resolve({
        'canvas': canvas.toDataURL('image/png')
      })
    } catch (err) {
      resolve({
        'canvas': ''
      })
    }
  })
}
