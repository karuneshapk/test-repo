import { AS_API_CALL } from './constants'

/**
 * Returns name of endpoints for module
 *
 * @param {string} moduleName - name of the module
 * @returns {string}
 */
export const getModuleEndpointsName = moduleName => `module_${moduleName}`

/**
 * Wrap PULA call action for given module
 *
 * @param {string} moduleName - name of a module
 * @param {Object} defaultOptions - default action options
 *
 * @returns {function(action:Object, payload:Object):Object} wrapped redux action
 */
export const createModuleApiAction = (moduleName, defaultOptions = {}) =>
  (action = {}, payload = {}) => ({
    [AS_API_CALL]: {
      endpointsName: getModuleEndpointsName(moduleName),
      ...defaultOptions,
      ...action
    },
    payload
  })

