import { setAvailableModules } from 'apollo-appstore/modules'
import {
  AS_INIT,
} from 'apollo-appstore/constants/actions'

import { setRights } from './rightsActions'
import { AS_ENDPOINTS_NAME } from '../constants/endpoints'

import {
  callApi,
  AS_AUTH_JWT,
} from '../middleware/api'

import { isAuthenticated } from '../utils/auth'

import { AS_AGENDA_SYSTEM } from 'apollo-appstore/constants/agendas'

import { resetStore } from 'apollo-library/actions/system'
import { synchronizeTime } from 'apollo-library/utils/time'
import { isDefined, prefixedRelativeUrl } from 'apollo-library/utils/common'
import { setAgenda } from './agendaActions'
import { routerReset } from '../router/actions'

/**
 * Available modules for appstore
 * @param {Object} mice - mice data
 *
 * @returns {Object} redux action
 */
const appStoreInit = mice => ({
  type: AS_INIT,
  environment: mice.environment,
  context: mice.context,
  services: mice.services
})

/**
 * Load default modules for given context
 *
 * @param {string} token - JWT token
 * @param {string} deviceId - device id
 *
 * @returns {function(dispatch:function, getState:function):Promise} redux action
 */
export const loadMice = () => {

  const callMiceApiAction = callApi({
    endpointsName: AS_ENDPOINTS_NAME,
    method: 'mice',
    auth: isAuthenticated() ? AS_AUTH_JWT : undefined,
  })

  return dispatch => dispatch(callMiceApiAction)
  .then(mice => {
    //@info ROUTER service is a mw_platform with no bussiness value
    //its a support service for apollo services thus always present
    //in any apollo parametrization
    const routerService = mice.services.find(service => service.name === 'ROUTER')

    if (isDefined(routerService)) {
      //We know that we are running in our application so
      //we will start syncing with server time
      // @TODO Need update to call api call
      synchronizeTime(prefixedRelativeUrl(routerService.proxy, '/public/time'))
    }

    dispatch(resetStore())
    dispatch(appStoreInit(mice))
    dispatch(setAvailableModules(mice.modules))
    dispatch(setRights(mice.rights))
    dispatch(setAgenda(AS_AGENDA_SYSTEM, {
      entryModule: mice.entry,
      currentContext: mice.context,
      environment: mice.environment,
      services: mice.services
    }))
    dispatch(routerReset())
    return mice
  })
}
