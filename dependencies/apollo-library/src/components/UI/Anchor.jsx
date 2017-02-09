import React, { Component, PropTypes } from 'react'

import { isUndefined, isFunction } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'

import { filterAProps } from 'apollo-library/utils/props'

/**
 * Safe Anchor component
 *
 * @module
 */
export class Anchor extends Component {

  static propTypes = {
    href: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.any.isRequired
  }

  static defaultProps = {
    disabled: false
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.handleOnClick = this.handleOnClick.bind(this)
  }

  /**
   * Handles anchor onClick event
   *
   * @param {SyntheticEvent} event
   */
  handleOnClick(event) {
    const {
      href,
      disabled,
      onClick
    } = this.props

    if (isUndefined(href) || disabled) {
      event.preventDefault()
    }

    if (disabled) {
      event.stopPropagation()
      return
    }

    if (isFunction(onClick)) {
      onClick(...arguments)
    }
  }

  /**
   * Render safe anchor component
   *
   * @override
   */
  render() {
    const {
      children,
      href,
      className,
      disabled,
      ...props
    } = this.props
    const classes = composeClassName(
      'pointer',
      disabled && 'disabled',
      className
    )

    return (
      <a
        role={href && href !== '#' ? 'link' : 'button'}
        className={classes}
        href={href}
        {...filterAProps(props)}
        onClick={this.handleOnClick}
      >
        {children}
      </a>
    )
  }

}

export default Anchor
