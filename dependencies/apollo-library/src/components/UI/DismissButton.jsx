import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Dismiss button for modal dialogs etc.
 *
 * @property {string|element} buttonLabel Visible text
 * @property {function} onClick - click callback
 *
 * @module
 */
export class DismissButton extends Component {

  static propTypes = {
    buttonLabel: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    buttonLabel: '×'
  }

  /**
   * Dismiss button renderer
   *
   * @return {ReactNode}
   */
  render() {
    var { onClick, className, buttonLabel } = this.props

    var classes = composeClassName(
      'dismiss-button',
      'close',
      'btn',
      'btn-link',
      className
    )

    return (
      <button
        className={classes}
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    )
  }

}

export default DismissButton

