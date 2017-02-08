import React, { Component } from 'react'

/**
 * Public layout
 */
export default class PublicLayout extends Component {

  /**
   * Renders public layout
   * @returns {ReactNode}
   */
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
