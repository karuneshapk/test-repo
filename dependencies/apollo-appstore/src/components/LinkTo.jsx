import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

import { injectRouter } from 'apollo-appstore/decorators/router'

 /**
 * Link component connected to router
 */
export class LinkTo extends Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    goTo: PropTypes.func.isRequired,
    linkTo: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  /**
   * Binds handleOnClick
   *
   * @constructor
   */
  constructor(...args) {
    super(...args)

    this.handleOnClick = this.handleOnClick.bind(this)
  }

  /**
   * Handles on click event
   *
   * @param {Event} event
   */
  handleOnClick(event) {
    const {
      goTo,
      to
    } = this.props

    event.preventDefault()
    event.stopPropagation()

    goTo(to)
  }

  /**
   * Renders anchor
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      to,
      children,
      linkTo,
      className
    } = this.props

    const classes = composeClassName(
      'pointer',
      className
    )

    return (
      <a
        href={linkTo(to)}
        onClick={this.handleOnClick}
        className={classes}
        {...this.props}
      >
        {children}
      </a>
    )
  }
}

export default injectRouter(LinkTo)
