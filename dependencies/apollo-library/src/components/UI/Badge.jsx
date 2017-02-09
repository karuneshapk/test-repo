import React, { Component, PropTypes } from 'react'

import { composeClassName, hasChildren } from 'apollo-library/utils/components'

/**
 * Element for showing badge with text
 *
 * @module
 */
export class Badge extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const { children, className } = this.props

    if (hasChildren(children)) {
      var classes = composeClassName(
        'badge', className
      )

      return (
        <span className={classes}>
          {children}
        </span>
      )
    } else {
      return <span/>
    }
  }

}

export default Badge
