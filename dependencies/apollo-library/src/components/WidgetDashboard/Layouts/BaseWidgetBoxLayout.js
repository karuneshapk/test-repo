import React from 'react'
import ReactDOM from 'react-dom'

import WidgetBoxLayout from 'apollo-library/components/WidgetDashboard/Layouts/WidgetBoxLayout'

/**
 * Base Box Layout for Widgets
 */
export class BaseWidgetBoxLayout extends WidgetBoxLayout {

  static direction = {
    row: 'row',
    reverseRow: 'row-reverse',
    column: 'column',
    reverseColumn: 'column-reverse'
  }

  static align = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center'
  }

  static alignByXAxis = {
    start: BaseWidgetBoxLayout.align.start,
    end: BaseWidgetBoxLayout.align.end,
    center: BaseWidgetBoxLayout.align.center,
    between: 'space-between',
    around: 'space-around'
  }

  static alignByYAxis = {
    start: BaseWidgetBoxLayout.align.start,
    end: BaseWidgetBoxLayout.align.end,
    center: BaseWidgetBoxLayout.align.center,
    stretch: 'stretch',
    baseline: 'baseline'
  }

  static wrap = {
    noWrap: 'nowrap',
    wrap: 'wrap',
    reverseWrap: 'wrap-reverse'
  }

  static defaultSettings = {
    direction: BaseWidgetBoxLayout.direction.row,
    alignByXAxis: BaseWidgetBoxLayout.alignByXAxis.start,
    alignByYAxis: BaseWidgetBoxLayout.alignByYAxis.stretch,
    alignContent: BaseWidgetBoxLayout.alignByYAxis.stretch,
    wrap: BaseWidgetBoxLayout.wrap.noWrap
  }

  /**
   * Initialize the layout
   *
   * @param {Object} settings - layout's settings
   */
  constructor(settings = {}) {
    super()
    this.settings = {
      ...BaseWidgetBoxLayout.defaultSettings,
      ...settings
    }
  }

  /**
   *
   * @param {*} widgetBox
   * @param {*} widgetBoxElement
   *
   * @return {ReactNode} layout
   */
  layout(widgetBox, widgetBoxElement) {
    var layoutedWidgetBox = super.layout(widgetBox, widgetBoxElement)
    const { style, ...widgetBoxPropsWithoutStyle } = layoutedWidgetBox.props
    const children = this.layoutWidgets(widgetBox, layoutedWidgetBox.props.children)

    return React.cloneElement(layoutedWidgetBox, {
      ...widgetBoxPropsWithoutStyle,
      style: {
        ...style,
        display: 'flex',
        flexFlow: `${this.settings.direction} ${this.settings.wrap}`,
        justifyContent: this.settings.alignByXAxis,
        alignItems: this.settings.alignByYAxis,
        alignContent: this.settings.alignContent
      },
      children
    }, children)
  }

  /**
   *
   * @param {*} widgetBox
   * @param {*} widgets
   *
   * @return {*}
   */
  layoutWidgets(widgetBox, widgets) {
    if (!Object.keys(widgetBox.refs).length ||
      this.settings.wrap === BaseWidgetBoxLayout.wrap.noWrap) {
      return widgets
    }

    var widgetBoxClientLengthAttribute, widgetOffsetLengthAttribute, widgetLengthAttribute,
      widgetMarginLeftAttribute, widgetMarginRightAttribute;
    if (this.settings.direction === BaseWidgetBoxLayout.direction.row) {
      widgetBoxClientLengthAttribute = 'clientWidth'
      widgetOffsetLengthAttribute = 'offsetWidth'
      widgetLengthAttribute = 'width'
      widgetMarginLeftAttribute = 'marginLeft'
      widgetMarginRightAttribute = 'marginRight'
    } else {
      widgetBoxClientLengthAttribute = 'clientHeight'
      widgetOffsetLengthAttribute = 'offsetHeight'
      widgetLengthAttribute = 'height'
      widgetMarginLeftAttribute = 'marginTop'
      widgetMarginRightAttribute = 'marginBottom'
    }

    const widgetBoxNode = ReactDOM.findDOMNode(widgetBox)
    const widgetBoxLength = widgetBoxNode[widgetBoxClientLengthAttribute]

    var widgetsLength = 0

    widgets.sort((widget1, widget2) => {
      const { style1 } = widget1.props
      const { style2 } = widget2.props
      const order1 = (style1 && style1.order) || 0
      const order2 = (style2 && style2.order) || 0
      return order1 - order2
    }).forEach(widget => {
      const widgetNode = ReactDOM.findDOMNode(widgetBox.refs[widget.ref])
      if (!widgetNode) {
        return
      }
      if (widget.props.type !== 'break') {
        const widgetNodeStyle = window.getComputedStyle(widgetNode)
        const {
          [ widgetMarginLeftAttribute ]: widgetMarginLeft,
          [ widgetMarginRightAttribute ]: widgetMarginRight
        } = widgetNodeStyle
        const widgetMargin = (widgetMarginLeft ? parseFloat(widgetMarginLeft) : 0) +
          (widgetMarginRight ? parseFloat(widgetMarginRight) : 0)

        widgetsLength += widgetNode[widgetOffsetLengthAttribute] + widgetMargin;
        if (widgetsLength >= widgetBoxLength) {
          widgetsLength = 0
        }
      } else {
        widgetNode.style[widgetLengthAttribute] = `${(widgetBoxLength - widgetsLength)}px`
      }
    })

    return widgets
  }

}

export default BaseWidgetBoxLayout

