import React, { Component, PropTypes } from 'react'

/**
 * Custom range handle
 */
export class CustomRangeHandle extends Component {

  static propTypes = {
    offset: PropTypes.number,
    value: PropTypes.any
  }

  render() {
    const { className, offset } = this.props
    return (
      <div className={className} style={{ left: `${offset}%` }}>
        <i className="fa fa-bars" />
      </div>
    )
  }

}


export default CustomRangeHandle
