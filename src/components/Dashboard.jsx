import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import messages from 'messages/layoutMessages'

/**
 * Backoffice dashboard
 */
export default class Dashboard extends Component {

  /**
   * Renders backoffice dashboard
   * @returns {ReactNode}
   */
  render() {
    return (
      <div className="dashboard container margin-t-l">
        <FormattedMessage {...messages.youAreLoggedIn} tagName="h3" />
        <FormattedMessage {...messages.chooseApplication} tagName="h4" />
      </div>
    )
  }
}
