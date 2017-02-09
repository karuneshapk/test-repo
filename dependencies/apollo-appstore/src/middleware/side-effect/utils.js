import { isDefined, isNil } from 'apollo-library/utils/common'

//@info saves original title present in index.html asset
const originalTitle = document.title

//postpones favicon setting to mantain full control
const defaultFavicon = (__APP_FAVICON__ === '')
  ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  : require(__APP_FAVICON__)

var favicon = document.querySelector('link[rel="shortcut icon"]')

if(isNil(favicon)) {
  favicon = document.createElement('link')

  favicon.rel = 'shortcut icon'
  favicon.type = 'image/x-icon'
  favicon.href = defaultFavicon
  document.getElementsByTagName('head')[0].appendChild(favicon)
}

/**
 * Sets favicon to new url
 *
 * @param {string} url - new favicon url
 */
export const setFavicon = url => {
  if (isDefined(url)) {
    favicon.href = url
  }
}

/**
 * Resets favicon to original state
 */
export const resetFavicon = () => {
  favicon.href = defaultFavicon
}

/**
 * Prepends page title with given text
 *
 * @param {string} text
 */
export const setTitle = text => {
  if (isDefined(text)) {
    document.title = `${text} | ${originalTitle}`
  }
}

/**
 * Resets page title to original state
 */
export const resetTitle = () => {
  document.title = originalTitle
}

/**
 * Set modal open class to body
 */
export const setModalOpen = () => {
  document.body.classList.toggle('modal-open', true)
}

/**
 * Reset modal open class to body tag
 */
export const resetModalOpen = () => {
  document.body.classList.toggle('modal-open', false)
}
