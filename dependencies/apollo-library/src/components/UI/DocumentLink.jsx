import React, { Component, PropTypes } from 'react'

import Anchor from 'apollo-library/components/UI/Anchor'

/**
 * Simple component - link to file with file icon
 *
 * @property {string} title - description
 * @property {string} type - type of file
 * @property {string} href - link to file
 */
export class DocumentLink extends Component {

  static propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    href: PropTypes.string.isRequired
  }

  render() {
    const {
      title,
      type,
      href,
      ...props
    } = this.props

    return (
      <Anchor href={href} {...props}>
        <i className="glyphicon glyphicon-file" />
        {' '}
        <span>{title || href}</span>
        {' '}
        {type && <span>{type}</span>}
      </Anchor>
    )
  }

}

export default DocumentLink
