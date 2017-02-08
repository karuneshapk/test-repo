import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { injectRights } from 'apollo-appstore/decorators/rights'
import Header from 'apollo-library/components/UI/Header'
import NavigationDropdown from 'apollo-library/containers/NavigationDropdown'
import NavigationMenu from 'apollo-library/containers/NavigationMenu'
import Navigation from 'apollo-library/components/UI/Navigation'

import {
  LEFT_DROPDOWN_ID,
  LEFT_DROPDOWN_ITEMS,
  RIGHT_DROPDOWN_ID,
  RIGHT_DROPDOWN_ITEMS,
} from '../constants/header'

import messages from '../messages/headerMessages'

/**
 * Backoffice layout
 */
export class BackofficeLayout extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    hasRights: PropTypes.func.isRequired,
  }

  /**
   * Filter menu items user has access to
   * @returns {Array}
   */
  filterMenuItems() {
    return LEFT_DROPDOWN_ITEMS.filter(item => {
      if (!item.rights) {
        return true
      } else {
        return this.props.hasRights.apply(undefined, item.rights)
      }
    }).sort((a, b) => a.priority - b.priority)
  }

  /**
   * Renders backoffice layout
   * @returns {ReactNode}
   */
  render() {
    return (
      <div>
        <Header
          id="operator-header"
          logoSrc={require('assets/logo-app.svg')}
          logoLinkClassName="logo-link"
          onLogoClick={() => this.props.push(process.env.PUBLIC_PATH)}
        >
          <Navigation
            type="nav"
            left
          >
            <NavigationDropdown
              id={LEFT_DROPDOWN_ID}
              menuTitle={<FormattedMessage {...messages.selectApplication} />}
              menuItems={this.filterMenuItems()}
              className="header-dropdown"
              menuClassName="header-dropdown__dropdown-menu"
            />
          </Navigation>
          <NavigationMenu
            className="navigation-menu"
          />
          <Navigation
            type="nav"
            right
          >
            <NavigationDropdown
              id={RIGHT_DROPDOWN_ID}
              menuItems={RIGHT_DROPDOWN_ITEMS}
              className="header-dropdown"
              menuClassName="header-dropdown__dropdown-menu"
            />
          </Navigation>
        </Header>
        {this.props.children}
      </div>
    )
  }
}

export default connect(() => ({}), {
  push,
})(injectRights(BackofficeLayout))
