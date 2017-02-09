import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { setActiveTab } from 'apollo-library/actions/tab'
import TabHeader from 'apollo-library/components/UI/TabHeader'
import TabBody from 'apollo-library/components/UI/TabBody'

import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * The tabbed component
 *
 * @property {Function} setActiveTab - a handler which handles a tab selection
 * @property {String} defaultActiveTab - defines a default active tab
 * @property {String} activeTab - defines an active tab
 * @property {String} name - defines a component name
 */
export class TabComponent extends Component {

  /** The component properties */
  static propTypes = {
    defaultActiveTab: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
  }

  /** @type {String} the component class*/
  static TAB_COMPONENT_CLASS = 'tab-component'

  /** @type {String} the component header class*/
  static TAB_COMPONENT_HEADER_CLASS = 'tab-component-header'

  /** @type {String} the component body class*/
  static TAB_COMPONENT_BODY_CLASS = 'tab-component-body'

  /**
   * Set active tab on the component mount
   */
  componentWillMount() {
    const {
      setActiveTab,
      defaultActiveTab,
      activeTab,
      name
    } = this.props

    var currentActiveTab = activeTab || defaultActiveTab
    setActiveTab(currentActiveTab, name)
  }

  /**
   * Handle tab selection
   *
   * @param tabName a newly selected tab name
   */
  handleTabSelect(tabName) {
    const { setActiveTab, name } = this.props
    setActiveTab(tabName, name)
  }

  /**
   * Render the react component
   *
   * @return {ReactNode} the react component
   */
  render() {
    const {
      children,
      activeTab,
      defaultActiveTab
    } = this.props

    var tabHeaders = []
    var tabBodies = []
    var currentActiveTab = (activeTab || defaultActiveTab)

    React.Children.forEach(children, child => {
      const { type } = child

      if (typeof type !== 'function') {
        return
      }

      switch (type.NAME) {

        case TabHeader.NAME: {
          tabHeaders.push(React.cloneElement(child, {
            handleTabSelect: this.handleTabSelect.bind(this),
            activeTab: currentActiveTab,
            key: tabHeaders.length,
            ...child.props
          }))
          break
        }

        case TabBody.NAME: {
          tabBodies.push(React.cloneElement(child, {
            activeTab: currentActiveTab,
            key: tabBodies.length,
            ...child.props
          }))
          break
        }

      }
    })

    return (
      <div
        className={TabComponent.TAB_COMPONENT_CLASS}
        {...filterDOMNodeProps(this.props)}
      >
        <ul key={TabHeader.NAME} className={TabComponent.TAB_COMPONENT_HEADER_CLASS}>
          {tabHeaders}
        </ul>
         <div key={TabBody.NAME} className={TabComponent.TAB_COMPONENT_BODY_CLASS}>
          {tabBodies}
        </div>
      </div>
    )
  }

}

export default connect(
  state => {
    const { tabComponent } = state.platform
    return {
      tabComponent
    }
  },
  {
    setActiveTab
  },
  (stateProps, dispatchProps, ownProps) => {
    const {
      tabComponent,
      ...statePropsWithoutState
    } = stateProps
    const tabComponentState = tabComponent.get(ownProps.name)
    const {
      activeTab,
      ...ownPropsWithoutActiveTab
    } = ownProps

    return Object.assign(
      {},
      statePropsWithoutState,
      dispatchProps,
      {
        activeTab: tabComponentState && tabComponentState.get('activeTab') || activeTab,
        ...ownPropsWithoutActiveTab
      }
    )
  }
)(TabComponent)
