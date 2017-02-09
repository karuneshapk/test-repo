import React, { Component, PropTypes } from 'react'

import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * Easy input label component
 *
 * @property {*} label Same like use this component pair
 *
 * @module
 */
export class InputLabel extends Component {

  static propTypes = {
    htmlFor: PropTypes.string,
    label: PropTypes.any
  }

  render() {
    const {
      label,
      children,
      ...props
    } = this.props

    const elementProps = filterDOMNodeProps(props, ['htmlfor', 'form'])

    return (
      <label {...elementProps}>
        {children || label}
      </label>
    )
  }

}

export default InputLabel
