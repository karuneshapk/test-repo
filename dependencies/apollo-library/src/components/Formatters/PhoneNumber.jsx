import React, { Component, PropTypes } from 'react'

import { formatPhoneNumber } from 'apollo-library/utils/phone'
import Anchor from 'apollo-library/components/UI/Anchor'

/**
 * Phone number element with formatting.
 *
 * @property {string} phoneNumber - raw phone number data
 * @property {boolean} isLink - if the anchor should be also generated. Default
 * is true.
 *
 * @module
 */
export class PhoneNumber extends Component {

  static propTypes = {
    phoneNumber: PropTypes.string,
    isLink: PropTypes.bool
  }

  static defaultProps = {
    phoneNumber: null,
    isLink: true
  }

  /**
   * Renders phone number text
   *
   * @return {ReactNode|boolean} Return false if phoneNumber is not defined
   */
  render() {
    let {isLink, phoneNumber} = this.props

    if (!phoneNumber) {
      return false
    }

    const formattedNumber = formatPhoneNumber(phoneNumber)

    if (isLink) {
      return (
        <Anchor href={`tel:${phoneNumber}`}>
          {formattedNumber}
        </Anchor>
      )
    } else {
      return (<span>{formattedNumber}</span>)
    }
  }

}

export default PhoneNumber
