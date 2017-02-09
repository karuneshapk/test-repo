import {
  AS_LOCALISATION_FETCHED,
  AS_LOCALISATION_LANGUAGE,
  AS_LOCALISATION_RELOADED,
} from '../constants/actions'

import { getModulePathPrefix } from '../utils/modules'
import { joinRelativeURL } from 'apollo-library/utils/common'

/**
 * Action creator for messages loaded
 *
 * @param {Object} messages
 * @param {string} language
 * @return {Object}
 */
export const localeLoaded = (messages, language) => ({
  type: AS_LOCALISATION_FETCHED,
  messages,
  language
})

/**
 * Load module locales
 * @param {string} module - module's name
 * @returns {function}
 */
export const getModuleLocales = module => (dispatch, getState) => {
  const modulePath = getModulePathPrefix(module)
  const language = getState().root.localisations.get('language')

  return getLocales(language, modulePath).then(locale => {
    dispatch(localeLoaded(locale, language))
    return locale
  })
}

/**
 * Change language
 *
 * @param {string} language - language
 * @returns {function}
 */
export const changeLanguage = language => {
  return (dispatch, getState) => {
    const state = getState()
    state.root.modules.get('loaded').keys().forEach(module => {
      dispatch(getModuleLocales(module))
    })
    dispatch(setLanguage(language))
  }
}

/**
 * Fetch action for download language dictionary
 *
 * @param {string} language
 * @param {string?} prefix
 * @return {Promise}
 */
export const getLocales = (language, prefix = '') => {
  const messagesUrl = joinRelativeURL(prefix, `/locale/${language}-messages.json`)
  return fetch(messagesUrl)
    .then(response => (response.status === 200)
      ? response.json()
      : null
    )
}

/**
 * Action creator for reload localization
 *
 * @return {Object}
 */
export const localeReloaded = () => ({
  type: AS_LOCALISATION_RELOADED
})

/**
 * Action creator for change language
 *
 * @param {string} language
 * @return {Object|function}
 */
export const setLanguage = language => ({
  type: AS_LOCALISATION_LANGUAGE,
  language
})
