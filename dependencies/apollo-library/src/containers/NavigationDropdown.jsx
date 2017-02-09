import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NavigationDropdown from 'apollo-library/components/UI/NavigationDropdown'
import { NAVIGATION_REDUCER } from 'apollo-library/constants/reducers'

import {
  navigationDropdownOpen,
  navigationDropdownClose,
} from 'apollo-library/actions/navigation'

/**
 * Navigation Dropdown container
 *
 */
class NavigationDropdownContainer extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    navigationDropdownOpen: PropTypes.func.isRequired,
    navigationDropdownClose: PropTypes.func.isRequired,
    id: PropTypes.string,
    isOpen: PropTypes.bool,
    menuTitle: PropTypes.node,
    menuItems: PropTypes.array,
    activeItem: PropTypes.string,
    className: PropTypes.string,
  }

  /**
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.openDropdownMenu = this.openDropdownMenu.bind(this)
    this.closeDropdownMenu = this.closeDropdownMenu.bind(this)
  }

  /**
   * Opens navigation dropdown
   */
  openDropdownMenu() {
    this.props.navigationDropdownOpen(this.props.id)
  }

  /**
   * Closes navigation dropdown
   */
  closeDropdownMenu() {
    this.props.navigationDropdownClose(this.props.id)
  }

  /**
   * Renderer
   *
   * @return {ReactElement}
   */
  render() {
    const {
      className,
      menuClassName,
      isOpen,
      menuItems,
      menuTitle,
      position,
      activeItem,
      push,
    } = this.props

    return (
      <NavigationDropdown
        className={className}
        menuClassName={menuClassName}
        isOpen={isOpen}
        openDropdownMenu={this.openDropdownMenu}
        closeDropdownMenu={this.closeDropdownMenu}
        menuItems={menuItems}
        menuTitle={menuTitle}
        position={position}
        activeItem={activeItem}
        push={push}
      />
    )
  }

}

export default connect((state, props) => {
  const navigation = state.platform[NAVIGATION_REDUCER]

  return {
    isOpen: navigation.getIn(['dropdown', 'open', props.id]),
    activeItem: navigation.getIn(['dropdown', 'active', props.id]),
    menuTitle: navigation.getIn(['dropdown', 'titles', props.id], props.menuTitle),
  }
}, {
  navigationDropdownOpen,
  navigationDropdownClose,
  push,
})(NavigationDropdownContainer)
