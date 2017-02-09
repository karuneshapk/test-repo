import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * The header of a tab
 *
 * @property {String} name - defines a name of a tab
 * @property {String} activeTab - defines a name of an active tab
 * @property {Function} handleTabSelect - a handler which handles a tab selection
 */
export class TabHeader extends Component {

  /** The component properties */
  static propTypes = {
    name: PropTypes.string.isRequired,
    handleTabSelect: PropTypes.func,
    activeTab: PropTypes.string
  }

  /** @type {String} the component name*/
  static NAME = 'TabHeader'

  /** @type {String} the class of a component*/
  static TAB_HEADER_CLASS = 'tab-header'

  /**
   * Handle a tab selection
   *
   * @param name {String} a name of a tab
   */
  handleTabSelect(name) {
    this.props.handleTabSelect(name)
  }

  /**
   * Render the component
   *
   * @return {ReactNode} the react component
   */
  render() {
    const { name, activeTab } = this.props
    const classes = composeClassName(
      TabHeader.TAB_HEADER_CLASS,
      name == activeTab && 'active'
    )

    return (
      <li
        role="presentation"
        className={classes}
        onClick={this.handleTabSelect.bind(this, name)}
      >
        {this.props.children}
      </li>
    )
  }

}

export default TabHeader
