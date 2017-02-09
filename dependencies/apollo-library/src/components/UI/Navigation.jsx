import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Navigation component
 *
 * @property {string} type One of ['pills', 'tabs', 'nav'] Default: pills
 * @property {?boolean} right Default: false
 * @property {?boolean} vertical Default: false
 * @property {?boolean} justified Probelm with safari Default: false
 */
export class Navigation extends Component {

  static propTypes = {
    type: PropTypes.oneOf([ 'pills', 'tabs', 'nav' ]).isRequired,
    children: PropTypes.any.isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    vertical: PropTypes.bool,
    justified: PropTypes.bool
  }

  static defaultProps = {
    type: 'pills',
    left: false,
    right: false,
    vertical: false,
    justified: false
  }

  /**
  * Render navigation component
  *
  * @override
  */
  render() {
    const {
      children,
      className,
      type,
      left,
      right,
      vertical,
      justified
    } = this.props

    const classes = composeClassName(
      'nav',
      (type === 'nav' ? 'navbar-nav' : `nav-${type}`),
      (type === 'nav' && right ? 'navbar-right' : left ? 'navbar-left' : false),
      vertical && 'nav-stacked',
      justified && 'nav-justified',
      className
    )

    return (
      <ul className={classes}>
        {children}
      </ul>
    )
  }

}

export default Navigation
