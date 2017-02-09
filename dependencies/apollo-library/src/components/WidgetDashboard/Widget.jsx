import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { DragSource } from 'react-dnd'
import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 *
 */
export class Widget extends Component {

  /** The component name */
  static componentName = 'Widget'

  /**
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.handleClick = this.handleClick.bind(this)
  }

  /**
   *
   */
  handleClick() {
    const {
      relayout,
      widgetId
    } = this.props

    //TO BE REMOVED, DONE JUST FOR DEMO
    this.setState({ hide: true })
    relayout(widgetId)
  }

  /**
   * Render the react compoent
   */
  render() {
    //TO BE REFACTORED, DONE JUST FOR DEMO
    if (this.state && this.state.hide) {
      return null
    }

    const { connectDragSource } = this.props

    return connectDragSource(
      <div
        {...filterDOMNodeProps(this.props)}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export default DragSource('widget', {
    beginDrag: props => new Object({ widgetId: props.id, order: props.style.order })
  },
  (connect, monitor) => new Object({connectDragSource: connect.dragSource()}))(Widget)
