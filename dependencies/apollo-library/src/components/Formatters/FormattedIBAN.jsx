import React, { Component, PropTypes } from 'react'
import { isUndefined } from 'apollo-library/utils/common'

import { composeClassName } from 'apollo-library/utils/components'

export class FormattedIBAN extends Component {

  static propTypes = {
    account: PropTypes.string
  }

  /**
   * Renders iban number separated by 4 characters
   *
   * @return {ReactNode}
   */
  render() {
    const {
      account,
      className
    } = this.props

    var classes = composeClassName(
      className
    )

    return isUndefined(account)
      ? false
      : (
        <span className={classes}>
          {account.match(/.{1,4}/g).join(' ')}
        </span>
        )
  }

}

export default FormattedIBAN