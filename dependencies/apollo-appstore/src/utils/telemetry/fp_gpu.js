/* Try to detect GPU name */
//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    try {
      var canvas = document.createElement('canvas')
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info')

      if (dbgRenderInfo != null) {
        resolve({
          'gpu': gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
        })
      } else {
        resolve({
          'gpu': gl.getParameter(gl.RENDERER)
        })
      }
    } catch (err) {
      resolve({
        'gpu': null
      })
    }
  })
}
