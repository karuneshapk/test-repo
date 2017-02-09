import React, { PropTypes, Component } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * Use the well as a simple effect on an element to give it an inset effect.
 *
 * @property {String} size - well padding size, one of the following: "lg", "sm"
 *
 * @module
 */
export class Well extends Component {

  static propTypes = {
    size: PropTypes.oneOf([ 'lg', 'sm' ]),
    className: PropTypes.string
  }

  static defaultProps = {
    size: 'large'
  }

  render() {
    const {
      size,
      className,
      children,
      ...props
    } = this.props;

    const classes = composeClassName(
      'well', `well-${size}`, className
    )

    return (
      <div className={classes} {...filterDOMNodeProps(props)}>
        {children}
      </div>
    )
  }

}

export default Well
