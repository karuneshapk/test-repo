
/* Fingerprint Latency */
export default () => {
  return new Promise(resolve => {
    try {
      // supported by a number of modern browsers
      var perfData = window.performance.timing
      var requestTime = perfData.responseStart - perfData.requestStart
      var networkLatency = perfData.responseEnd - perfData.fetchStart
      resolve({
        'latency': requestTime + '~' + networkLatency
      })
    } catch (err) {
      resolve({
        'latency': null
      })
    }
  })
}
