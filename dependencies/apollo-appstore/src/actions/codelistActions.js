import { callApi, AS_AUTH_JWT } from '../middleware/api'

import {
  AS_GET_CODELIST_SUCCESS,
  AS_GET_CODELIST_REQUEST
} from '../constants/actions'

import { isAuthenticated } from 'apollo-appstore/utils/auth'

export const getCodeLists = service => {
  return callApi(getPulaObject(service, isAuthenticated()), {service})
}

const getPulaObject = (service, isPrivate) => {

  const context = isPrivate ? 'private' : 'public'
  const endpoint = `/${context}/codeList/getCodeLists`

  const pulaObject = {
    service,
    endpoint,
    httpMethod: 'post',
    actions: {
      request: AS_GET_CODELIST_REQUEST,
      success: AS_GET_CODELIST_SUCCESS
    }
  }

  if(isPrivate) {
    pulaObject.auth = AS_AUTH_JWT
  }

  return pulaObject

}
