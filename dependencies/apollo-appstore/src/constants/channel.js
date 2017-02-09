export const AS_HEARTBEAT_INTERVAL = 5000
export const AS_TIMEOUT_INTERVAL = 60000
export const AS_RECONNECT_INTERVAL = 3000
export const AS_RECONNECT_TRIES = 3
export const AS_RECONNECT_TRYAGAIN_TIMEOUT = 60000

/**
 * authorize channel with token to enable tuneling protected services
 *
 * @param {string} token - authorization token
 *
 * @returns {string} authorization packet
 */
export const AS_AUTHORIZE_CHANNEL = token => `a|${token}`

/**
 * ping packet
 *
 * @returns {string} ping channel packet
 */
export const AS_PING_CHANNEL = ''

/**
 * create (register) ws connection with service backend
 *
 * @param {string} id - module to register into channel
 * @param {string} path - **kwargs for service
 *
 * @returns {string} register service packet
 */
export const AS_REGISTER_CHANNEL = (id, path) => `r|${id}|${path}`

/**
 * close (unregister) ws connection with service backend
 *
 * @param {string} id - module to terminate
 *
 * @returns {string} close packet
 */
export const AS_UNREGISTER_CHANNEL = id => `c|${id}`
