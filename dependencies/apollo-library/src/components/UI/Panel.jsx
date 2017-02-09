import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { composeClassName } from 'apollo-library/utils/components'
import Anchor from 'apollo-library/components/UI/Anchor' 
import { filterDOMNodeProps } from 'apollo-library/utils/props'


/**
 * Panel component
 *
 * @property {String} size - well padding size, one of the following: "lg",
 *   "large", "sm", "small"
 *
 * @module
 */
export class Panel extends Component {

  static propTypes = {
    collapsible: React.PropTypes.bool,
    header: React.PropTypes.node,
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    type: PropTypes.oneOf([
      'success',
      'warning',
      'danger',
      'info',
      'default',
      'primary'
    ]),
    footer: React.PropTypes.node,
    expanded: React.PropTypes.bool,
    eventKey: React.PropTypes.any,
    headerRole: React.PropTypes.string,
    panelRole: React.PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    type: 'default',
    expanded: true
  }

  constructor(props) {
    super(props)
    this.state = { expanded: !!props.expanded, opacity: props.expanded ? 1 : 0 }
    this.handleCollapserClick = this.handleCollapserClick.bind(this)
  }

  componentWillMount() {
    const { collapsible, expanded } = this.props
    collapsible && !expanded && this.setState({expanded: true})
  }

  componentDidMount() {
    const { collapsible, expanded } = this.props
    if (collapsible) {
      const panel = ReactDOM.findDOMNode(this.refs.panel)
      this.setState({ panelHeight: `${panel.offsetHeight}px`, opacity: 1, expanded })
    }
  }

  handleCollapserClick() {
    const newState = {expanded: !this.state.expanded}
    if (!newState.expanded) {
      const panel = ReactDOM.findDOMNode(this.refs.panel)
      panel.style.height = newState.panelHeight = `${panel.offsetHeight}px`
      setTimeout(this.setState.bind(this, newState, null), 10)
      return
    }
    this.setState(newState)
  }

  renderHeading() {
    let { header } = this.props

    if (!header) {
      return null
    }

    if (React.isValidElement(header)) {
      header = React.cloneElement(header, {
        className: composeClassName(
          'panel-title', header.props.className
        )
      })
    }

    return (
      <div className='panel-heading'>
        {header}
      </div>
    )
  }

  renderFooter() {
    const { footer } = this.props

    return footer
      ? (
        <div className='panel-footer'>
          {footer}
        </div>
        )
      : null
  }

  shouldRenderFill(child) {
    return React.isValidElement(child) && child.props.fill !== null
  }

  renderBody(expanded) {
    let allChildren = this.props.children
    let bodyElements = []
    let panelBodyChildren = []
    let bodyClass = 'panel-body'

    const opacity = expanded && this.state.opacity || 0

    function getProps() {
      return { key: bodyElements.length, className: bodyClass, style: { opacity } }
    }

    function addPanelChild(child) {
      bodyElements.push(React.cloneElement(child, getProps()))
    }

    function addPanelBody(children) {
      bodyElements.push(
        <div className={bodyClass} {...getProps()}>
          {children}
        </div>
      )
    }

    function maybeRenderPanelBody() {
      if (panelBodyChildren.length === 0) {
        return
      }

      addPanelBody(panelBodyChildren)
      panelBodyChildren = []
    }

    // Handle edge cases where we should not iterate through children.
    if (!Array.isArray(allChildren) || allChildren.length === 0) {
      if (this.shouldRenderFill(allChildren)) {
        addPanelChild(allChildren)
      } else {
        addPanelBody(allChildren)
      }
    } else {
      allChildren.forEach( child => {
        if (this.shouldRenderFill(child)) {
          maybeRenderPanelBody()

          // Separately add the filled element.
          addPanelChild(child)
        } else {
          panelBodyChildren.push(child)
        }
      })

      maybeRenderPanelBody()
    }

    return bodyElements
  }

  renderPanelSwitcher() {
    const { switcherName } = this.props
    const classes=[ 'panel-switcher', this.state.expanded ? 'down-direction' : 'right-direction' ]
    return (
      <Anchor
        className={composeClassName(...classes)}
        onClick={this.handleCollapserClick}
      >
        <div className="panel-switcher-form" />
        {switcherName}
      </Anchor>
    )
  }

  render() {
    const { className, id, type, headerRole, collapsible } = this.props
    const { expanded, panelHeight } = this.state
    const classes = ['panel', `panel-${type}`, className]

    var panelStyle
    if (collapsible) {
      classes.push(expanded ? 'expanded' : 'collapsed')
      panelStyle = expanded && panelHeight ? { height: panelHeight } : null
    }

    return (
      <div className={collapsible ? 'panel-collapsible' : ''}>
        {collapsible && this.renderPanelSwitcher()}
        <div
          id={id}
          className={composeClassName(...classes)}
          style={panelStyle}
          ref="panel"
          {...filterDOMNodeProps(this.props)}
          onTransitionEnd={panelStyle && this.setState.bind(this, {panelHeight: 'auto'}, null)}
        >
          {this.renderHeading(headerRole)}
          {this.renderBody(expanded)}
          {this.renderFooter()}
        </div>
      </div>
    )
  }

}

export default Panel

