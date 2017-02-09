/**
 * Api method that echos back data in promise means
 *
 * @param {Object} data - payload to echo back
 *
 * @returns {Promise} chain link
 */
export default data => new Promise((resolve, reject) => {
  try {
    return resolve(data)
  } catch(e) {
    return reject(e)
  }
})
