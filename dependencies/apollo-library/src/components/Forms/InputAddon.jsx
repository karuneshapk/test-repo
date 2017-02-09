import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { ADDON_TYPES } from 'apollo-library/constants/components'

/**
 * Input addon component
 * Small component reflected
 *  @see {@url http://getbootstrap.com/components/#input-groups-basic}
 *
 * @property {!ADDON_TYPES} type
 * @property {!*} children
 *
 * @param {Object} props
 * @return {React.Element}
 */
export class InputAddon extends Component {

  static propTypes = {
    type: PropTypes.oneOf(Map(ADDON_TYPES).toArray()).isRequired,
    children: PropTypes.any.isRequired
  }

  render() {
    const {
      type,
      children
    } = this.props

    return (type === ADDON_TYPES.BUTTON)
      ? (
        <div className={`input-group-${type}`}>
          {children}
        </div>
        )
      : (
        <span className={`input-group-${type}`}>
          {children}
        </span>
        )
  }

}

export default InputAddon
