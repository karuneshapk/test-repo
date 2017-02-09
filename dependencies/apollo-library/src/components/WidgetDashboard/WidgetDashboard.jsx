import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import WidgetBox from 'apollo-library/components/WidgetDashboard/WidgetBox'
import BaseWidgetBoxLayout from 'apollo-library/components/WidgetDashboard/Layouts/BaseWidgetBoxLayout'

export class WidgetDashboard extends Component {
  
  /** The component properties */
  static propTypes = {
    name: PropTypes.string,
    config: PropTypes.object
  }

  /** The widget dashboard context */
  static childContextTypes = {
    widgetDashboardConfig: React.PropTypes.object
  }

  /** The widget box layouts */
  static widgetBoxLayouts = {
    baseLayout: BaseWidgetBoxLayout
  }

  /**
   *
   */
  constructor() {
    super()
    this.children = null
  }

  /**
   * Create child context
   *
   * @return {{widgetDashboardConfig: object}}
   */
  getChildContext() {
    return {
      widgetDashboardConfig: this.props.config
    }
  }

  /**
   *
   */
  componentWillMount() {
    var layout = this.createLayout()
    this.children = React.Children.map(this.props.children, child => {
      const { type } = child;
      return (typeof type == 'function' && type.componentName == WidgetBox.componentName) ?
        React.cloneElement(child, {layout, ...child.props}, child.props.children) : child
    })
  }

  /**
   * Create a layout component which will place widgets according to its rules inside a widget box
   */
  createLayout() {
    const { config } = this.props
    const type = (config && config.type)

    var Layout, layoutSettings

    switch (type) {

      case 'riverFlow':
      case 'stretchedFlow': {
        Layout = WidgetDashboard.widgetBoxLayouts['baseLayout'];
        layoutSettings = type === 'riverFlow'
          ? {
              alignByYAxis: BaseWidgetBoxLayout.alignByYAxis.start,
              alignContent: BaseWidgetBoxLayout.alignByYAxis.start,
              wrap: BaseWidgetBoxLayout.wrap.wrap
            }
          : {
              wrap: BaseWidgetBoxLayout.wrap.wrap
            }
        break
      }

      default: throw new TypeError(`The widget box layout type ${type} is unknown`);
    }

    return new Layout(layoutSettings);
  }

  /**
   * Render the react component
   */
  render() {
    return (
      <div {...this.props}>
        {this.children}
      </div>
    )
  }

}

export default DragDropContext(HTML5Backend)(WidgetDashboard)
