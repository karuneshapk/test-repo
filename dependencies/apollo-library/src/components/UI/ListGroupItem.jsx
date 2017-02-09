import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { filterDOMNodeProps } from 'apollo-library/utils/props'

import Anchor from './Anchor'

// Available list group types
const TYPE = {
  LIST: 'list',
  BUTTON: 'button',
  LINK: 'link'
}

/**
 * Bootstrap list group item component
 * Output by tupe:
 * - link: <Anchor> @see Anchor Component
 * - button: <button>
 * - list: <li>
 *
 * @property {string} type One of [list, button, link] Default: list
 * @property {boolean} active Is item selected Default: false
 * @property {boolean} disabled Is item disabled Default: false
 * @property {string} context Bootstrap context
 *  @see {http://getbootstrap.com/components/#list-group-contextual-classes}
 *  Default: default (without context)
 * @property {*} customHeading Custom content heading
 *  @see {http://getbootstrap.com/components/#list-group-custom-content}
 * @property {*} customText Custom content text
 *  @see {http://getbootstrap.com/components/#list-group-custom-content}
 */
export class ListGroupItem extends Component {

  static propTypes = {
    type: PropTypes.oneOf([
      TYPE.LIST,
      TYPE.BUTTON,
      TYPE.LINK
    ]),
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    context: PropTypes.oneOf([
      'success', 'info', 'warning', 'danger', 'default'
    ]),
    customHeading: PropTypes.any,
    customText: PropTypes.any
  }

  static defaultProps = {
    type: TYPE.LIST,
    active: false,
    disable: false,
    context: 'default'
  }

  /**
   * Available list group types
   * @enum {string}
   */
  static TYPE = TYPE

  /**
   * Custom content renderer
   *
   * @param {*} heading
   * @param {*} text
   * @return {Array}
   */
  renderCustomContent(heading, text) {
    var content = []
    if (heading) {
      content.push(
        <h4
          key="lgiHeading"
          className="list-group-item-heading"
        >
          {heading}
        </h4>
      )
    }
    if (text) {
      content.push(
        <p
          key="lgiText"
          className="list-group-item-text"
        >
          {text}
        </p>
      )
    }
    return content
  }

  /**
   * Reander list group item by param
   *
   * @return {ReactNode}
   */
  render() {
    const {
      type,
      children,
      active,
      context,
      disabled,
      className,
      customHeading,
      customText,
      ...props
    } = this.props

    const classes = composeClassName(
      className,
      'list-group-item',
      active && 'active',
      disabled && 'disabled',
      (context !== 'default') && `list-group-item-${context}`
    )

    const content = this.renderCustomContent(customHeading, customText)

    switch (type) {

      case ListGroupItem.TYPE.LIST: {
        return (
          <li className={classes} {...filterDOMNodeProps(props)}>
            {content}
            {children}
          </li>
        )
      }

      case ListGroupItem.TYPE.BUTTON: {
        return (
          <button
            type="button"
            className={classes}
            disabled={disabled}
            {...props}
          >
            {content}
            {children}
          </button>
        )
      }

      case ListGroupItem.TYPE.LINK: {
        return (
          <Anchor
            className={classes}
            disabled={disabled}
            {...props}
          >
            {content}
            {children}
          </Anchor>
        )
      }

    }

    return null
  }

}

export default ListGroupItem
