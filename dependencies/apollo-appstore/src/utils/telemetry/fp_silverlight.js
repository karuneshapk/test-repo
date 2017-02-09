/*
 * This function returns the major version of Microsoft Silverlight by interrogating
 * the activex control
 */

//Works in Tor
export default () => {
  return new Promise(resolve => {
    var objControl = null
    var objPlugin = null
    var strSilverlightVersion = null

    try {
      try {
        objControl = new window.ActiveXObject('AgControl.AgControl')
        if (objControl.IsVersionSupported('5.0')) {
          strSilverlightVersion = '5.x'
        } else if (objControl.IsVersionSupported('4.0')) {
          strSilverlightVersion = '4.x'
        } else if (objControl.IsVersionSupported('3.0')) {
          strSilverlightVersion = '3.x'
        } else if (objControl.IsVersionSupported('2.0')) {
          strSilverlightVersion = '2.x'
        } else {
          strSilverlightVersion = '1.x'
        }
        objControl = null
      } catch (e) {
        objPlugin = navigator.plugins['Silverlight Plug-In']
        if (objPlugin) {
          if (objPlugin.description === '1.0.30226.2') {
            strSilverlightVersion = '2.x'
          } else {
            strSilverlightVersion = parseInt(objPlugin.description[0], 10)
          }
        } else {
          strSilverlightVersion = 'N/A'
        }
      }

      return resolve({
        'silverlight': strSilverlightVersion
      })
    } catch (err) {
      resolve({
        'silverlight': null
      })
    }
  })
}
