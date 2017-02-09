import { defineMessages } from 'react-intl'

export default defineMessages({

  forceLogout: {
    id: 'api.error.forceLogout',
    description: 'Error message shown when user was logged off by the system',
    defaultMessage: 'You were logged out for security reasons'
  },
  serverGenericError: {
    id: 'api.error.generic',
    description: 'Generic message for user when there was unexpected server error',
    defaultMessage: 'There was a problem with server, please try again later'
  },
  serverGenericErrorWithId: {
    id: 'api.error.genericWithId',
    description: 'Generic message for debugging',
    defaultMessage: '{idCall}'
  }

})
