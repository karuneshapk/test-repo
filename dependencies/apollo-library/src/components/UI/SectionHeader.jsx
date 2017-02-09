import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Header component for any section
 *
 * @property {string} text - text for the header
 * @property {string} textClasses - css classes for header text
 *
 * @module
 */
export class SectionHeader extends Component {

  static propTypes = {
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    className: PropTypes.string
  }

  static defaultProps = {
    className: 'h2'
  }

  render() {
    const { className, text } = this.props
    const classes = composeClassName(
      'section-header',
      className,
      'modal-title'
    )

    return (
      <div className={classes}>
        {text}
      </div>
    )
  }

}

export default SectionHeader
