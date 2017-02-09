import React, { Component } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'

import { isUndefined, trim } from 'apollo-library/utils/common'

var messages = defineMessages({
  fullName: {
    id: 'platform.common.fullName',
    description: 'Full name of a person used accross system',
    defaultMessage: '{titleBefore, select, undefined {} other {{titleBefore} }}{firstName, select, undefined {} other {{firstName} }}{middleName, select, undefined {} other {{middleName} }}{lastName, select, undefined {} other {{lastName}}}{titleAfter, select, undefined {} other {, {titleAfter}}}'
  }
})

export class FullName extends Component {

  static propTypes = {
    party: React.PropTypes.oneOfType([
      ImmutablePropTypes.map,
      React.PropTypes.object
    ]).isRequired
  }

  render() {
    let { party, intl, children } = this.props

    if (isUndefined(party)) {
      return null
    }

    /* transform to immutable object */
    party = fromJS(party)

    const firstName = party.get('firstName')
    const middleName = party.get('middleName')
    const lastName = party.get('lastName')

    if (!firstName && !middleName && !lastName) {
      return null
    }

    var fullName = party.size
      ? trim(intl.formatMessage(messages.fullName, {
        titleBefore: party.get('titleBefore'),
        firstName,
        middleName,
        lastName,
        titleAfter: party.get('titleAfter')
      }))
      : ''

    return (
      <span>{fullName === '' ? null : fullName}{children}</span>
    )
  }

}

export default injectIntl(FullName)
