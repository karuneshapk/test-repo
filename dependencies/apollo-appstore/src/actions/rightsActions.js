import { AS_AGENDA_RIGHTS } from 'apollo-appstore/constants/agendas'

import { callApi, AS_AUTH_JWT } from '../middleware/api'
import { setAgenda } from './agendaActions'
import { AS_ENDPOINTS_NAME } from '../constants/endpoints'

/**
 * Process rights
 * @param {Array} rights
 * @returns {Object}
 */
const processRights = rights => {
  return (rights || []).reduce(
    (obj, item) => ({ ...obj, ...item }),
    {}
  )
}

/**
 * Actions to set rights
 * @param {Object} rights
 * @returns {function}
 */
export const setRights = rights => setAgenda(AS_AGENDA_RIGHTS, processRights(rights))

/**
 * Load rights
 * @returns {Object}
 */
export const loadRights = () => dispatch => {
  return dispatch(callApi({
    endpointsName: AS_ENDPOINTS_NAME,
    method: 'rights',
    auth: AS_AUTH_JWT,
  })).then(rights => dispatch(setRights(rights)))
}
