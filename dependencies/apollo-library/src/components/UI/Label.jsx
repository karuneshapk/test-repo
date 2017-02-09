import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { CONTEXTUAL_COLORS } from 'apollo-library/constants/components'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Element for showing labeled text
 *
 * @param {string} type - label type (style), one of the following:
 *  "success", "warning", "danger", "default", "primary", "link" or "info"
 * @param {string|React.element} text - label content
 * @param {string} className
 */
export class Label extends Component {

  static propTypes = {
    type: PropTypes.oneOf(Map(CONTEXTUAL_COLORS).toArray()),
    className: PropTypes.string,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ])
  }

  static defaultProps = {
    type: CONTEXTUAL_COLORS.DEFAULT
  }

  render() {
    const { type, text, className } = this.props

    return (
      <span className={composeClassName(
        'label', `label-${type}`, className
      )}>
        {text}
      </span>
    )
  }

}

export default Label
