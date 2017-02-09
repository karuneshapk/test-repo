import { fromJS } from 'immutable'

import { ALLOWED_RESULTS } from 'constants/authentication'

/**
 * Returns initial value or auth step object.
 *
 * idAuthProcess, authStepDetails and wrongAuthValueare are used as props for
 * AuthStep component, and authenticate can be used to check whether to render
 * AuthStep component.
 *
 * @returns {ImmutableMap}
 */
export const getInitialAuth = () => fromJS({
  idAuthProcess: '',
  authStepDetails: [],
  wrongAuthValue: false,
  authenticate: false,
  reCaptchaRequired: false
})

/**
 * Genereate step values for AuthStep
 *
 * @param {string} authDetailType
 * @param {*} value
 * @param {?Array} stepValues - Default array for merge steps
 * @return {Array}
 */
export const generateStepValues = (authDetailType, value, stepValues = []) => {
  stepValues.push({
    authDetailType,
    value
  })

  return stepValues
}
/**
 * Returns updated auth step object.
 *
 * Used for updating auth step object after MW returns 418 with authentication details.
 *
 * @param {object} payload - api action payload, values returned with 418 http code
 * @param {ImmutableMap} authMap - carrent value of auth step object
 *
 * @returns {ImmutableMap}
 */
export const mergeAuthenticationObject = (payload, authMap) => {
  const {
    result,
    scenarios,
    nextStep,
    idAuthProcess
  } = payload

  switch (result) {

    case ALLOWED_RESULTS.REQUIRED: {
      var idProcess = ''
      var authStepDetails = []
      if (scenarios && scenarios[0]) {
        idProcess = scenarios[0].idAuthProcess || scenarios[0].processId
        authStepDetails = scenarios[0].steps
          && scenarios[0].steps[0]
          && scenarios[0].steps[0].details
          || authStepDetails
      }
      return authMap.merge({
        idAuthProcess: idProcess,
        authStepDetails,
        reCaptchaRequired: false,
        wrongAuthValue: false,
        authenticate: true
      })
    }

    case ALLOWED_RESULTS.ROBOT_SMELL: {
      return authMap.merge({
        reCaptchaRequired: true
      })
    }

    case ALLOWED_RESULTS.NEXT_STEP: {
      return authMap.merge({
        reCaptchaRequired: false,
        idAuthProcess,
        authStepDetails: nextStep && nextStep.details || [],
        wrongAuthValue: false
      })
    }

    case ALLOWED_RESULTS.WRONG_VALUE: {
      return authMap.merge({
        reCaptchaRequired: false,
        wrongAuthValue: true
      })
    }

  }

  return authMap
}
