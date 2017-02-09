import React, { Component, PropTypes } from 'react'

import Navigation from 'apollo-library/components/UI/Navigation'
import MenuItem from 'apollo-library/components/UI/MenuItem'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Displays navigation items in header
 */
export class NavigationMenu extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    menuItems: PropTypes.array
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
  }

  /**
   * Handle click on Menu item
   *
   * @param {SyntheticEvent} event
   */
  handleMenuItemClick(event = window.event) {
    event.preventDefault()

    const { currentTarget: anchor } = event

    this.props.push(anchor.href.replace(window.location.origin, ''))
  }

  /**
   * Renders menu items
   *
   * @returns {ReactNode}
   */
  renderMenuItems() {
    const {
      activeItem,
      menuItems,
    } = this.props

    return menuItems && menuItems.map(menuItem => (
      <MenuItem
        key={menuItem.url}
        href={menuItem.url}
        active={menuItem.id === activeItem}
        onClick={this.handleMenuItemClick}
      >
        {menuItem.title}
      </MenuItem>
    ))
  }

  /**
   * Renders top menu
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      className,
      menuItems,
    } = this.props

    if (!menuItems) {
      return false
    }

    return (
      <Navigation
        type="nav"
        className={className}
      >
        {this.renderMenuItems()}
      </Navigation>
    )
  }

}

export default NavigationMenu
