import { Map, fromJS } from 'immutable'

import {
  AS_LOCALISATION_FETCHED,
  AS_LOCALISATION_LANGUAGE,
  AS_LOCALISATION_RELOADED
} from '../constants/actions'

const initialState = Map({
  available: Map(),
  messages: Map(),
  refresh: false,
  language: null
})

const setCurrentLocalisation = (state, language) => {
  const messages = state.getIn([ 'available', language ], Map())

  if (messages && !messages.isEmpty()) {
    return state.merge(Map({
      messages,
      language,
      refresh: true
    }))
  } else {
    // no language change as there are no messages for this language
    return state
  }
}

/**
 * Redux data transformer for intl localisation aware components
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export default (state = initialState, action) => {

  switch (action.type) {

    case AS_LOCALISATION_FETCHED: {
      const { language } = action
      const messagesPath = ['available', language]
      const availableLocales = state.getIn(messagesPath, Map())

      return setCurrentLocalisation(state.setIn(
        messagesPath,
        Map(action.messages).merge(availableLocales)
      ), language)
    }

    case AS_LOCALISATION_LANGUAGE: {
      const { language } = action

      return setCurrentLocalisation(state, language)
    }

    case AS_LOCALISATION_RELOADED: {
      return state.set('refresh', false)
    }

  }

  return state
}
