import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { composeClassName } from 'apollo-library/utils/components'

import Anchor from 'apollo-library/components/UI/Anchor'

/**
 * Navigation menu item
 *
 * @property {boolean=} active Active navigation item Default: false
 * @property {boolean=} separator Separate menu Default: false
 * @property {boolean=} disabled Disabled navigation item Default: false
 *
 * @module
 */
export class MenuItem extends Component {

  static propTypes = {
    active: PropTypes.bool,
    separator: PropTypes.bool,
    disabled: PropTypes.bool,
    listClassName: PropTypes.string,
  }

  static defaultProps = {
    active: false,
    separator: false,
    disabled: false,
    listClassName: 'menu-item'
  }

  /**
   * Render menu item component
   * @example output: <li role="presentation"><a>text</a></li>
   *
   * @override
   */
  render() {
    const {
      children,
      active,
      separator,
      disabled,
      listClassName,
      className,
      ...props
    } = this.props
    var role = 'presentation'

    if (separator) {
      role = 'divider'
    }

    const htmlClasses = composeClassName(
      listClassName,
      active && 'active',
      separator && 'divider',
      disabled && 'disabled'
    )

    const linkClassName = className || `${listClassName}__link`

    return (
      <li role={role} className={htmlClasses}>
        {!separator && (
          <Anchor
            disabled={disabled}
            className={linkClassName}
            {...props}
          >
            {children}
          </Anchor>
        )}
      </li>
    )
  }

}

export default MenuItem
