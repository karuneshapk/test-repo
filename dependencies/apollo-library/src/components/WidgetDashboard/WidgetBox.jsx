import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'

import Widget from 'apollo-library/components/WidgetDashboard/Widget'

export class WidgetBox extends Component {
  
  /** The component properties */
  static propTypes = {
    layout: PropTypes.object
  }

  /** The component name */
  static componentName = 'WidgetBox'

  /**
   * Initialize widget box component
   */
  constructor() {
    super()
    this.widgets = null
    this.widgetBox = null
  }

  /**
   *
   */
  componentWillMount() {
    const { layout } = this.props;
    this.widgetBox = layout.layout(this, (
      <div {...this.props}>
        {this.props.children}
      </div>
    ));
  }

  /**
   *
   */
  componentDidMount() {
    const { layout } = this.props

    if (layout.isTwoPhaseLayout(this.widgetBox)) {
      this.widgetBox = layout.layout(this, this.widgetBox)
      this.forceUpdate()
    }
  }

  //TO BE REFACTORED, DONE JUST FOR DEMO
  relayout(widgetId) {
    const { layout } = this.props

    if (layout.isTwoPhaseLayout(this.widgetBox)) {
      setTimeout(() => {
        this.widgetBox = layout.layout(this, this.widgetBox)
        this.forceUpdate()
      }, 0)
    }

    this.setState({ widgetId })
  }

  /**
   * Render the react compoent
   */
  render() {
    //TODO create a separate method
    if (this.widgets == null) {
      this.widgets = []
      React.Children.forEach(this.widgetBox.props.children, (child, index) => {
        if (!child) {
          return
        }

        const { type } = child
        
        if (typeof type == 'function' && type.componentName == Widget.componentName) {
          const widgetId = `widget_${index}`
          this.widgets.push(
            React.cloneElement(child, {
              ref: widgetId,
              key: widgetId,
              id: widgetId,
              relayout: this.relayout.bind(this),
              ...child.props
            }, child.props.children)
          )
        }
      })
    }

    const { connectDropTarget } = this.props

    this.widgetBox = connectDropTarget(
      <div {...{...this.widgetBox.props, children: this.widgets}}>
        {this.widgets}
      </div>
    )

    return this.widgetBox
  }

}

export default DropTarget('widget', {
  drop: (_, monitor) => {
    monitor.overlappedWidget = null
  },
  hover: (props, monitor, widgetBox) => {
    const draggingWidgetItem = monitor.getItem()
    const mouseCursorPosition = monitor.getClientOffset()

    var draggingWidget, overlappedWidget

    widgetBox.widgets.forEach(widget => {
      const widgetNode = ReactDOM.findDOMNode(widgetBox.refs[widget.ref])
      if (!widgetNode) {
        return
      }
      if (widget.props.id !== draggingWidgetItem.widgetId) {
        const widgetClientRect = widgetNode.getBoundingClientRect()
        if (mouseCursorPosition.x >= widgetClientRect.left && mouseCursorPosition.x <= widgetClientRect.right &&
            mouseCursorPosition.y >= widgetClientRect.top && mouseCursorPosition.y <= widgetClientRect.bottom) {
          overlappedWidget = widgetNode
        }
      } else {
        draggingWidget = widgetNode
      }
    });

    if (monitor.overlappedWidget) {
      const widgetClientRect = monitor.overlappedWidget.getBoundingClientRect();
      if (mouseCursorPosition.x < widgetClientRect.left || mouseCursorPosition.x > widgetClientRect.right ||
        mouseCursorPosition.y < widgetClientRect.top || mouseCursorPosition.y > widgetClientRect.bottom) {
        monitor.overlappedWidget = null
      }
    }

    if (draggingWidget && overlappedWidget && !monitor.overlappedWidget) {
      // TODO REFACTOR TO REACT STYLE
      const draggingWidgetOrder = draggingWidget.style.order
      const overlappedWidgetOrder = overlappedWidget.style.order

      draggingWidget.style.order = overlappedWidgetOrder
      overlappedWidget.style.order = draggingWidgetOrder
      monitor.overlappedWidget = overlappedWidget
    }
  }},
  (connect, monitor) => new Object({ connectDropTarget: connect.dropTarget() }))(WidgetBox)

