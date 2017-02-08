import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { logout } from 'apollo-appstore/actions/authActions'
import { AS_AUTH_JWT } from 'apollo-appstore/middleware/api'

import commonMessages from 'apollo-library/messages/common'

/**
 * Logout container
 */
export class LogoutContainer extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired,
  }

  /**
   * Logout user
   */
  componentWillMount() {
    this.props.logout({
      auth: AS_AUTH_JWT
    })
  }

  /**
   * Renders backoffice layout
   * @returns {ReactNode}
   */
  render() {
    return (
      <div className="container-fluid margin-t-s max600">
        <FormattedMessage {...commonMessages.loggingOut} />
      </div>
    )
  }
}

export default connect(() => ({}), {
  logout,
})(LogoutContainer)

