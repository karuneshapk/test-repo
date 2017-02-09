import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Validation Message component
 *
 * @property {Bool} show - whether to show the message
 * @property {Object} message - in react-intl 2.0 format
 *
 * @module
 */
export class ValidationMessage extends Component {

  static propTypes = {
    show: PropTypes.bool,
    message: PropTypes.any
  }

  render() {
    const {
      className,
      show,
      message
    } = this.props

    const classes = composeClassName(
      'help-block',
      className
    )

    return (
      <div className={classes}>
        {show &&
          <FormattedMessage {...message.message} values={message.values} />
        }
      </div>
    )
  }

}

export default ValidationMessage
