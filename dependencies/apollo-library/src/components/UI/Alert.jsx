import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { CONTEXTUAL_COLORS } from 'apollo-library/constants/components'

import { isFunction } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Element for showing single notification
 *
 * @property {function} onDismiss - function to call when alert is dismissed
 * @property {function} deferDismiss - function to call to dismiss the alert in
 * dismissAfter milliseconds
 * @property {string} type - notification type (style), one of the following:
 * "success" (default), "warning", "danger" (+ not currently used "default",
 * "primary", "link", "info")
 * @property {string} text - notification text
 * @property {number} dismissAfter - how long until notification is closed (in
 * milliseconds)
 * @property {string} idNotification - unique id
 * @property {boolean} isNotification - if it's a notification
 *
 * @module
 */
export class Alert extends Component {

  static propTypes = {
    type: PropTypes.oneOf(Map(CONTEXTUAL_COLORS).toArray()),
    onDismiss: PropTypes.func,
    dismissAfter: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    deferDismiss: PropTypes.func,
    text: PropTypes.any,
    idNotification: PropTypes.string,
    isNotification: PropTypes.bool
  }

  static defaultProps = {
    type: 'success',
    dismissAfter: 5000
  }

  /**
   * After component did mount registred deferDismiss
   */
  componentDidMount() {
    if (this.props.isNotification) {
      const {
        deferDismiss,
        idNotification,
        type,
        dismissAfter
      } = this.props

      if (isFunction(deferDismiss)) {
        deferDismiss(idNotification, type, dismissAfter)
      }
    }
  }

  /**
   * Render component
   *
   * @return {ReactElement}
   */
  render() {
    const {
      onDismiss,
      type,
      text,
      children,
      className,
      isNotification
    } = this.props

    var classes = composeClassName(
      'alert',
      `alert-${type}`,
      className
    )

    return (
      <div className={classes}>
        {isNotification &&
          <button className="close" onClick={onDismiss}>
            {'×'}
          </button>
        }
        {text}
        {children}
      </div>
    )
  }

}

export default Alert
