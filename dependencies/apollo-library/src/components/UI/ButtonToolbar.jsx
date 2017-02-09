import React, { PropTypes, Component } from 'react'
import { composeClassName } from 'apollo-library/utils/components'
import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * Element for wrapping multiple separated buttons
 *
 * @module
 */
export class ButtonToolbar extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const { children, className, ...props } = this.props

    var classes = composeClassName(
      'btn-toolbar',
      className
    )

    const elementProps = filterDOMNodeProps(props)

    return (
      <div className={classes} {...elementProps}>
        {children}
      </div>
    )
  }

}

export default ButtonToolbar
