//Doesnt work in Tor
export default () => {
  return new Promise(resolve => {
    try {
      var result = []
      if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) // eslint-disable-line no-unused-vars, max-len
        || ('ActiveXObject' in window)) {

        // starting to detect plugins in IE
        result = Array.prototype.map([
          // Adobe PDF reader 7+
          'AcroPDF.PDF',
          'Adodb.Stream',
          // Silverlight
          'AgControl.AgControl',
          'DevalVRXCtrl.DevalVRXCtrl.1',
          'MacromediaFlashPaper.MacromediaFlashPaper',
          'Msxml2.DOMDocument',
          'Msxml2.XMLHTTP',
          // Adobe PDF reader 6 and earlier, brrr
          'PDF.PdfCtrl',
          // QuickTime
          'QuickTime.QuickTime',
          'QuickTimeCheckObject.QuickTimeCheck.1',
          'RealPlayer',
          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
          'Scripting.Dictionary',
          // ShockWave player
          'SWCtl.SWCtl',
          'Shell.UIHelper',
          //flash plugin
          'ShockwaveFlash.ShockwaveFlash',
          'Skype.Detection',
          'TDCCtl.TDCCtl',
          // Windows media player
          'WMPlayer.OCX',
          'rmocx.RealPlayer G2 Control',
          'rmocx.RealPlayer G2 Control.1'
        ], name => {
          try {
            new window.ActiveXObject(name)
            return name
          } catch(e) {
            return ''
          }
        });
      }

      for (let i = 0; i < navigator.plugins.length; i++) {
        result.push(navigator.plugins[i].name)
      }

      result = result.sort((a, b) => (a.name > b.name)
        ? 1
        : (
          a.name < b.name
            ? -1
            : 0
        )
      )

      resolve({
        'plugins': result
      })
    } catch (err) {
      resolve({
        'plugins': null
      })
    }
  })
}
