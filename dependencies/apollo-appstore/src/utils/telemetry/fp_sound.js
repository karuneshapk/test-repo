export default () => {

  var run_nt_vc_fp = new Promise(resolve => {
    try {
      // Performs fingerprint as found in some versions of http://metrics.nt.vc/metrics.js
      const a = (a, b, c) => {
        /* eslint-disable no-unused-expressions */
        for (var d in b) {
          'dopplerFactor' === d || 'speedOfSound' === d || 'currentTime' === d ||
          'number' !== typeof b[d] && 'string' !== typeof b[d] || (a[(c ? c : '') + d] = b[d])
        }
        /* eslint-enable no-unused-expressions */
        return a
      }
      var nt_vc_output
      var nt_vc_context = (window.AudioContext || window.webkitAudioContext)
      if ('function' !== typeof nt_vc_context) {
        resolve({
          'props': null
        })
      } else {
        var f = new nt_vc_context
        var d = f.createAnalyser()
        nt_vc_output = a({}, f, 'ac-')
        nt_vc_output = a(nt_vc_output, f.destination, 'ac-')
        nt_vc_output = a(nt_vc_output, f.listener, 'ac-')
        nt_vc_output = a(nt_vc_output, d, 'an-')
        resolve({
          'props': nt_vc_output
        })
      }
    } catch (g) {
      nt_vc_output = 0
      resolve({
        'props': null
      })
    }

  });

  // Performs a hybrid of cc/pxi methods found above
  var run_hybrid_fp = new Promise(resolve => {
    try {
      /*
      var hybrid_output = []
      var audioCtx = new(window.AudioContext || window.webkitAudioContext)
      var oscillator = audioCtx.createOscillator()
      var analyser = audioCtx.createAnalyser()
      var gain = audioCtx.createGain()
      var scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1)

      // Create and configure compressor
      var compressor = audioCtx.createDynamicsCompressor()
      if (compressor.threshold) {
        compressor.threshold.value = -50
      }
      if (compressor.knee) {
        compressor.knee.value = 40
      }
      if (compressor.knee) {
        compressor.knee.value = 40
      }
      if (compressor.ratio) {
        compressor.ratio.value = 12
      }
      if (compressor.reduction) {
        compressor.reduction.value = -20
      }
      if (compressor.attack) {
        compressor.attack.value = 0
      }
      if (compressor.release) {
        compressor.release.value = .25
      }

      gain.gain.value = 0 // Disable volume
      oscillator.type = 'triangle' // Set oscillator to output triangle wave
      oscillator.connect(compressor) // Connect oscillator output to dynamic compressor
      compressor.connect(analyser) // Connect compressor to analyser
      analyser.connect(scriptProcessor) // Connect analyser output to scriptProcessor input
      scriptProcessor.connect(gain) // Connect scriptProcessor output to gain input
      gain.connect(audioCtx.destination) // Connect gain output to audiocontext destination

      scriptProcessor.onaudioprocess = function (bins) {
        bins = new Float32Array(analyser.frequencyBinCount)
        analyser.getFloatFrequencyData(bins)
        for (var i = 0; i < bins.length; i = i + 1) {
          hybrid_output.push(bins[i])
        }
        analyser.disconnect()
        scriptProcessor.disconnect()
        gain.disconnect()
        resolve({
          'probe': hybrid_output.slice(0,30)
        })
      }
      oscillator.start(0)
      */
      resolve({
        'probe': []
      })
    } catch(err) {
      resolve({
        'probe': []
      })
    }
  })

  return new Promise(resolve => {
    Promise.all([run_nt_vc_fp, run_hybrid_fp]).then(result => {
      resolve({
        'sound': {
          ...result[0],
          ...result[1]
        }
      })
    }, () => {
      resolve({
        'sound': {
          'props': null,
          'probe': null
        }
      })
    })
  })
}
