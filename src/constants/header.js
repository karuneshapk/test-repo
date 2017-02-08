import React from 'react'
import { FormattedMessage } from 'react-intl'

import { prefixedRelativeUrl } from 'apollo-library/utils/common'

import messages from '../messages/headerMessages'
import commonMessages from 'apollo-library/messages/common'

export const LEFT_DROPDOWN = {
}

export const LEFT_DROPDOWN_ID = 'applicationMenu'

export const LEFT_DROPDOWN_ITEMS = [
]

export const RIGHT_DROPDOWN = {
  LOGOUT: 'logout',
}

export const RIGHT_DROPDOWN_ID = 'accountMenu'

export const RIGHT_DROPDOWN_ITEMS = [
  {
    id: RIGHT_DROPDOWN.LOGOUT,
    url: prefixedRelativeUrl('/logout'),
    title: <FormattedMessage {...commonMessages.logout} />,
  },
]
