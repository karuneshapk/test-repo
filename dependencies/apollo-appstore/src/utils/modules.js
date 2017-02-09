/* global __MODULE_PATH__ */
import { prefixedRelativeUrl } from 'apollo-library/utils/common'

/**
 * Returns modules path prefix
 * @param {string} moduleName
 * @returns {string}
 */
export const getModulePathPrefix = moduleName => {
  const modulePath = process.env.MODULE_PATH || ''
  const modulePrefix = modulePath.replace('${moduleName}', moduleName)

  return prefixedRelativeUrl(modulePrefix, 'latest')
}
