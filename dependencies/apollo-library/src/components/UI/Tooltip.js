import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { TOOLTIP_PLACEMENT } from 'apollo-library/constants/components'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Tooltip element
 *
 * @property {string} title - tooltip text
 * @property {TOOLTIP_PLACEMENT} placement - tooltip position
 * @property {string} className - arbitrary class name that is applied to
 *   bootstrap part of component
 *
 * @example
 *   <Tooltip title='This is a tooltip'>Target</Tooltip>
 *
 * @module
 */
export class Tooltip extends Component {

  static propTypes = {
    placement: PropTypes.oneOf(Map(TOOLTIP_PLACEMENT).toArray()),
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    className: PropTypes.string
  }

  static defaultProps = {
    placement: TOOLTIP_PLACEMENT.TOP
  }

  /**
   * Init state for tooltip and bind handle function
   *
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.state = {
      show: false,
      styles: {}
    }

    this.handleTargetMouseAction = this.handleTargetMouseAction.bind(this)
  }

  /**
   * Handle mouse actions and set flag for showing
   *
   * @param {SyntheticEvent.MouseOver|SyntheticEvent.MouseOut} event - mouse event
   */
  handleTargetMouseAction(event) {
    event.stopPropagation()

    this.setState({ show: !this.state.show }, () => {
      this.setState({ styles: this.getPlacementStyles(this.props.placement) })
    })
  }

  /**
   * Update styles position
   */

  /**
   * Count position of tooltip
   *
   * @param {TOOLTIP_PLACEMENT} placement
   * @return {Object}
   */
  getPlacementStyles(placement) {
    const {
      tooltip = {},
      target = {}
    } = this.refs

    const {
      offsetHeight: overlayHeight = 0,
      offsetWidth: overlayWidth = 0
    } = tooltip

    const {
      offsetHeight: targetHeight = 0,
      offsetWidth: targetWidth = 0,
      offsetTop: targetTop = 0,
      offsetLeft: targetLeft = 0
    } = target

    switch (placement) {

      case TOOLTIP_PLACEMENT.TOP: {
        return {
          top: (targetTop - overlayHeight + 5) + 'px',
          left: (targetLeft - ((overlayWidth / 2) - (targetWidth / 2))) + 'px'
        }
      }

      case TOOLTIP_PLACEMENT.BOTTOM: {
        return {
          top: (targetTop + targetHeight) + 'px',
          left: (targetLeft - ((overlayWidth / 2) - (targetWidth / 2))) + 'px'
        }
      }

      case TOOLTIP_PLACEMENT.LEFT: {
        return {
          top: (targetTop - ((overlayHeight - targetHeight) / 2)) + 'px',
          left: (targetLeft - overlayWidth - 5) + 'px'
        }
      }

      case TOOLTIP_PLACEMENT.RIGHT: {
        return {
          top: (targetTop - ((overlayHeight - targetHeight) / 2)) + 'px',
          left: (targetLeft + targetWidth + 5) + 'px'
        }
      }

    }

    return {}
  }

  /**
   * Render tooltip component if have title
   *
   * @return {ReactNode}
   */
  render() {
    const {
      children,
      title,
      className,
      placement
    } = this.props

    if (!title) {
      return <frag>{children}</frag>
    }

    const classes = composeClassName(
      'tooltip',
      'in',
      !this.state.show && 'hide',
      placement,
      className
    )

    return (
      <frag>
        <frag
          ref="target"
          onMouseOver={this.handleTargetMouseAction}
          onMouseOut={this.handleTargetMouseAction}
        >
          {children}
        </frag>
        <div
          ref="tooltip"
          role="tooltip"
          className={classes}
          style={this.state.styles}
        >
          <div className="tooltip-arrow" />
          <div className="tooltip-inner">
            {title}
          </div>
        </div>
      </frag>
    )
  }

}

export default Tooltip
