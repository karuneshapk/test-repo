import React, { Component, PropTypes } from 'react'

import { isUndefined } from 'apollo-library/utils/common'
import Anchor from 'apollo-library/components/UI/Anchor'

/**
 * Email element read-only input.
 *
 * @property {string} email - email string
 * @property {boolean} isLink - if the anchor should be also generated.
 * Default is true.
 *
 * @module
 */
export class Email extends Component {

  static propTypes = {
    email: PropTypes.string,
    isLink: PropTypes.bool
  }

  static defaultProps = {
    isLink: true
  }

  /**
   * Renders email text
   *
   * @return {ReactNode|boolean} Return false if email is not defined
   */
  render() {
    const { email, isLink } = this.props

    if (isUndefined(email)) {
      return false
    }

    return isLink
      ? <Anchor href={`mailto:${email}`}>{email}</Anchor>
      : <span>{email}</span>
  }

}

export default Email
