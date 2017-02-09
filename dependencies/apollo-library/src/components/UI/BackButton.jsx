import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import Anchor from 'apollo-library/components/UI/Anchor'
import CommonMessages from 'apollo-library/messages/common'

/**
 * Simple component styled like back button
 *
 * @property {string} href - link url
 */
export class BackButton extends Component {

  static propTypes = {
    href: PropTypes.string.isRequired
  }

  render() {
    return (
      <Anchor
        className='btn btn-default btn-sm'
        size='sm'
        {...this.props}
      >
        <span className='fa fa-reply' />
        {' '}
        <FormattedMessage {...CommonMessages.back} />
      </Anchor>
    )
  }

}

export default BackButton
