import React, { Component, PropTypes } from 'react'

import Anchor from 'apollo-library/components/UI/Anchor'
import { composeClassName } from 'apollo-library/utils/components'
import { NAVIGATION_DROPDOWN_POSITION } from 'apollo-library/constants/navigation'

/**
 * Header component module
 *
 * @property {bool} menuOpen - is dropdown menu currently open
 *
 */
export default class NavigationDropdown extends Component {

  static propTypes = {
    openDropdownMenu: PropTypes.func.isRequired,
    closeDropdownMenu: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    menuTitle: PropTypes.node,
    menuItems: PropTypes.array,
    activeItem: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isOpen: false,
    menuTitle: '',
    menuItems: [],
  }

  /**
   * Prebinds handle methods
   *
   * @constructor
   */
  constructor(...args) {
    super(...args)

    this.clickDropdownMenu = this.clickDropdownMenu.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }


  /**
   * close the menu when dropdown icon loses focus
   * but what for 100ms so click event can bubble first
   */
  onBlur() {
    const {
      isOpen,
      closeDropdownMenu,
    } = this.props

    if (isOpen) {
      //TODO possible memory leak and racing condition
      setTimeout(closeDropdownMenu, 200)
    }
  }

  /**
   * Get active item
   * @returns {?Object}
   */
  getActiveItem() {
    const {
      menuItems,
      activeItem,
    } = this.props

    return menuItems.find(item => item.id === activeItem)
  }

  /**
   * Returns title for dropdown
   * @returns {string|ReactElement}
   */
  getTitle() {
    const {
      menuTitle,
    } = this.props

    const activeItem = this.getActiveItem()

    return activeItem
      ? activeItem.title
      : menuTitle
  }

  /**
   * clicking on menu item
   * @param {Object} menuItem - menu item
   * @param {Event} event
   */
  clickMenuItem(menuItem, event) {
    event.preventDefault()
    this.props.push(menuItem.url)
  }

  /**
   * clicking on dropdown icon in header toggles the menu
   */
  clickDropdownMenu(event) {
    const {
      isOpen,
      openDropdownMenu,
      closeDropdownMenu,
    } = this.props

    event.preventDefault()

    if (isOpen) {
      closeDropdownMenu()
    } else {
      openDropdownMenu()
    }
  }

  /**
   * Renders menu items
   * @returns {Array.<ReactElement>}
   */
  renderMenuItems() {
    const {
      menuItems,
    } = this.props

    return menuItems.map(menuItem => (
      <li
        key={`navigation-menu-item-${menuItem.id}`}
        className="dropdown-menu-item"
      >
        <Anchor
          className="dropdown-menu-item__link"
          href={menuItem.url}
          onClick={this.clickMenuItem.bind(this, menuItem)}
        >
          {menuItem.title}
        </Anchor>
      </li>
    ))
  }

  /**
   * Renders additional content into header for every entry module
   *
   * @returns {ReactElement}
   */
  render() {
    const {
      isOpen,
      className,
      menuClassName,
    } = this.props

    const dropdownWrapperClass = composeClassName(
      'dropdown',
      className,
      isOpen && 'open',
    )

    const dropdownClasses = composeClassName(
      'dropdown-menu',
      menuClassName,
    )

    const linkDropdownClasses = composeClassName(
      'dropdown-toggle',
      `${className}__link`,
    )

    const items = this.renderMenuItems()
    const title = this.getTitle()

    return (
      <li
        className={dropdownWrapperClass}
        onBlur={this.onBlur}
        tabIndex="1"
      >
        <Anchor
          className={linkDropdownClasses}
          href="#"
          onClick={this.clickDropdownMenu}
        >
          {title}
          <span className="caret" />
        </Anchor>
        <ul className={dropdownClasses}>
          {items}
        </ul>
      </li>
    )
  }

}
