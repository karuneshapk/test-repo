import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Element Row Column
 *
 * @module
 */
export class Row extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const { className, children } = this.props
    const classes = composeClassName('row', className)

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }

}

export default Row
