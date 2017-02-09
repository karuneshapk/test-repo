import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NavigationMenu from 'apollo-library/components/UI/NavigationMenu'

import { NAVIGATION_REDUCER } from 'apollo-library/constants/reducers'

/**
 * Navigation Dropdown container
 *
 */
class NavigationMenuContainer extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    items: PropTypes.array,
    activeItem: PropTypes.string,
  }

  /**
   * Renderer
   *
   * @return {ReactElement}
   */
  render() {
    const {
      items,
      activeItem,
      push,
      className,
    } = this.props

    return (
      <NavigationMenu
        menuItems={items}
        activeItem={activeItem}
        push={push}
        className={className}
      />
    )
  }

}

export default connect(state => {
  const navigation = state.platform[NAVIGATION_REDUCER]

  return {
    items: navigation.getIn(['menu', 'items']),
    activeItem: navigation.getIn(['menu', 'activeItem']),
  }
}, {
  push,
})(NavigationMenuContainer)
