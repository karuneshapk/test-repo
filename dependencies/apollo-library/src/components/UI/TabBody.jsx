import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * The body of a tab
 *
 * @property {String} name - defines a name of a tab
 * @property {String} activeTab - defines a name of an active tab
 */
export class TabBody extends Component {

  /** The component properties */
  static propTypes = {
    name: PropTypes.string.isRequired,
    activeTab: PropTypes.string
  }

  /** @type {String} the name of a component */
  static NAME = 'TabBody'

  /** @type {String} the class of a component */
  static TAB_BODY_CLASS = 'tab-body'

  /**
   * Render the component
   *
   * @return {ReactNode} the react component
   */
  render() {
    const {
      name,
      activeTab,
      children
    } = this.props

    const className = composeClassName(
      TabBody.TAB_BODY_CLASS,
      name === activeTab && 'active'
    )

    return (
      <div className={className}>
        {children}
      </div>
    )
  }

}

export default TabBody
