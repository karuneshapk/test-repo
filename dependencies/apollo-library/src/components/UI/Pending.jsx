import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Element for pending state placeholder
 *
 * @module
 */
export class Pending extends Component {

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  }

  render() {
    const {
      className,
      style
    } = this.props

    const classes = composeClassName(
      'pending',
      className
    )

    return (
      <div className={classes} style={style} />
    )
  }

}

export default Pending
