import {
  MODAL_SHOW,
  MODAL_HIDE
} from 'apollo-library/constants/actions'
import { isDefined } from 'apollo-library/utils/common'

import storage from 'apollo-appstore/utils/storage'

import {
  AS_TITLE_SET,
  AS_TITLE_RESET,
  AS_FAVICON_SET,
  AS_FAVICON_RESET,
  AS_REDIRECT_TO_URI,
  AS_STORAGE_SET,
  AS_STORAGE_REMOVE,
  AS_STORAGE_CLEAR
} from './constants'

import {
  setFavicon,
  resetFavicon,
  setTitle,
  resetTitle,
  setModalOpen,
  resetModalOpen
} from './utils'

/**
 * Creates redux middleware for out-of-redux actions like favicon change
 * page title change and native notifications providing application with
 * redux actions
 *
 * @returns {function}
 */
export const sideEffectMiddleware = () => next => action => {

  switch (action.type) {
    case AS_STORAGE_CLEAR: {
      return storage.clear()
    }

    case AS_STORAGE_REMOVE: {
      return storage.remove(action.key)
    }

    case AS_STORAGE_SET: {
      return storage.set(action.key, action.value)
    }

    case AS_REDIRECT_TO_URI: {
      if (isDefined(action.uri)) {
        window.location.replace(action.uri)
        return
      }
      break
    }

    case AS_TITLE_SET: {
      return setTitle(action.title)
    }

    case AS_TITLE_RESET: {
      return resetTitle()
    }

    case AS_FAVICON_SET: {
      return setFavicon(action.url)
    }

    case AS_FAVICON_RESET: {
      return resetFavicon()
    }

    case MODAL_SHOW: {
      setModalOpen()
      break
    }

    case MODAL_HIDE: {
      resetModalOpen()
      break
    }

  }

  return next(action)
}
