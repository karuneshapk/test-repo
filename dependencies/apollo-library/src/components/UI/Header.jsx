import React, { Component, PropTypes } from 'react'

import Anchor from 'apollo-library/components/UI/Anchor'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Header component module
 *
 * @property {ReactNode} hamburger - hamburger menu instance
 * @property {function} logoClick - logo link click callback
 *
 */
export class Header extends Component {

  static propTypes = {
    logoClick: PropTypes.func,
    logoSrc: PropTypes.string,
    logoAlt: PropTypes.string,
    onLogoClick: PropTypes.func,
    className: PropTypes.string,
    extensionLeft: PropTypes.any,
    leftDropdownMenu: PropTypes.any,
    extensionMiddleLeft: PropTypes.any,
    navigationMenu: PropTypes.any,
    extensionMiddleRight: PropTypes.any,
    rightDropdownMenu: PropTypes.any,
    extensionRight: PropTypes.any,
  }

  static defaultProps = {
    logoClick: () => {},
  }

  /**
   * Renders application header with logo on the left and hamburger menu
   * on the right
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      id,
      onLogoClick,
      logoSrc,
      logoAlt,
      logoLinkClassName,
      className,
    } = this.props

    const classes = composeClassName(
      'navbar',
      'navbar-default',
      className
    )

    const anchorLinkClasses = composeClassName(
      'left',
      logoLinkClassName,
      'navbar-brand'
    )

    return (
      <div id={id} className={classes}>
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              aria-expanded="false"
            >
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Anchor
              onClick={onLogoClick}
              className={anchorLinkClasses}
            >
              <img
                src={logoSrc}
                alt={logoAlt}
                className="header-logo"
              />
            </Anchor>
          </div>

          <div className="collapse navbar-collapse">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }

}

export default Header

