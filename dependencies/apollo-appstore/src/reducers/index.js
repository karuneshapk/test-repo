import { combineReducers } from 'redux'
import modules from './modulesReducer'
import shared  from './sharedReducer'
import agendas from './agendasReducer'
import codelists from './codelistReducer'
import localisations from './localisations'
import endpoints from './endpointsReducer'

export default combineReducers({
  modules,
  shared,
  agendas,
  codelists,
  localisations,
  endpoints,
})
