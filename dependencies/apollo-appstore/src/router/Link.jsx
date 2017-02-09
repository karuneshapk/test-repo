import React, { Component, PropTypes } from 'react'
import { injectRouter } from 'apollo-appstore/decorators/router'

import { isUndefined, isFunction } from 'apollo-library/utils/common'

import { Anchor } from 'apollo-library/components/UI/Anchor'

/**
 * AppStore router Link component
 */
export class Link extends Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
    linkTo: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    onClick: PropTypes.func
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
   * Handle anchor click
   *
   * @param {SyntheticEvent} event
   * @return {boolean}
   */
  handleOnClick(event) {
    const {
      to,
      goTo,
      onClick
    } = this.props
    var useGoTo = true

    if (isFunction(onClick)) {
      const result = onClick(...arguments)
      // Same function like normal anchor
      useGoTo = isUndefined(result) ? useGoTo : result
    }

    if (useGoTo) {
      event.preventDefault()
      goTo(to)
    }

    return useGoTo
  }

  /**
   * Component render function
   *
   * @return {ReactElement}
   */
  render() {
    const {
      to,
      linkTo,
      ...props
    } = this.props

    return (
      <Anchor
        {...props}
        href={linkTo(to)}
        onClick={this.handleOnClick}
      />
    )
  }
}

export default injectRouter(Link)
