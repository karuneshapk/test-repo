import React from 'react'

import Widget from 'apollo-library/components/WidgetDashboard/Widget'

/**
 * Interface for Box Layout for Widgets
 */
export class WidgetBoxLayout {

  /**
   *
   */
  constructor() {
    if (this.constructor === WidgetBoxLayout) {
      throw new TypeError(
        'WidgetLayout class is an abstract class, thus it can\'t be constructed.'
      )
    }
  }

  /**
   *
   * @param {*} widgetBox
   * @param {*} widgetBoxElement
   *
   * @return {Object}
   */
  layout(widgetBox, widgetBoxElement) {
    return widgetBoxElement
  }

  /**
   *
   * @param {*} widgetBox
   *
   * @return {boolean}
   */
  isTwoPhaseLayout(widgetBox = null) {
    var isTwoPhaseLayout = false

    if (widgetBox) {
      React.Children.forEach(widgetBox.props.children, child => {
        const { type } = child
        if (typeof type === 'function' && type.componentName === Widget.componentName
          && child.props.type === 'break') {
          isTwoPhaseLayout = true
        }
      })
    }
    return isTwoPhaseLayout
  }

}

export default WidgetBoxLayout

