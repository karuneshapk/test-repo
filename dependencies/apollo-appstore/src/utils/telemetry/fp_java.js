/**
 * This function detects if Java is enabled in browser
 * returns "true" if enabled, "false" if not enabled "ERROR" elsewise
 */
//Works in Tor
//{"mozPay":null,"mozContacts":{},"mozApps":{},"mozTCPSocket":null}
export default () => {
  return new Promise(resolve => {
    try {
      resolve({
        'java': navigator.javaEnabled()
      })
    } catch (err) {
      resolve({
        'java': false
      })
    }
  })
}
