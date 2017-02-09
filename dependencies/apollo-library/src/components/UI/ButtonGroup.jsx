import React, { Component, PropTypes } from 'react'
import all from 'react-prop-types/lib/all'

import { composeClassName } from 'apollo-library/utils/components'

import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * Element for grouping buttons
 *
 * @property {Boolean} justified -  Display justified buttons
 * @property {Boolean} vertical -  Display vertical buttons
 * @property {Boolean} block - Display block buttons, only useful when used
 *   with the "vertical" prop.
 *
 * @module
 */
export class ButtonGroup extends Component {

  static propTypes = {
    justified: PropTypes.bool,
    vertical: PropTypes.bool,
    block: all(
      React.PropTypes.bool,
      props => {
        if (__DEV__ && props.block && !props.vertical) {
          return new Error(`
  The block property requires the vertical property to be set to have any effect
          `)
        }
      }
    ),
    size: PropTypes.oneOf([
      'lg',
      'sm',
      'xs',
      false
    ]),
    className: PropTypes.string
  }

  static defaultProps = {
    block: false,
    justified: false,
    vertical: false,
    size: false
  }

  render() {
    const {
      size,
      vertical,
      justified,
      block,
      children,
      className
    } = this.props

    var classes = composeClassName(
      !vertical && 'btn-group',
      vertical && 'btn-group-vertical',
      justified && 'btn-group-justified',
      block && 'btn-block',
      size && `btn-group-${size}`,
      className
    )

    return (
      <div className={classes}{...filterDOMNodeProps(this.props)}>
        {children}
      </div>
    )
  }

}

export default ButtonGroup

