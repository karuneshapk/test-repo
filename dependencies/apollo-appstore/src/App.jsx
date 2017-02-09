/* global __DEV__, __DEVTOOLS__ */
import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { Map } from 'immutable'

import Modals from 'apollo-library/containers/Modals'
import Notifications from 'apollo-library/containers/Notifications'
import FormValidationUtils from 'apollo-library/utils/formValidation'
import inputMasking from 'apollo-library/utils/inputMasking'
import formats from 'apollo-library/locale/formats'
import { setDefaultFormOptions } from 'apollo-library/actions/form'

import Router from 'apollo-appstore/router/Router'
import storage from 'apollo-appstore/utils/storage'
import { AS_AGENDA_SYSTEM } from 'apollo-appstore/constants/agendas'

/**
 * Application class
 */
class App extends Component {

  static propTypes = {
    error: PropTypes.bool,
    locales: ImmutablePropTypes.map,
    setDefaultFormOptions: PropTypes.func.isRequired,
    moduleLoader: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    contextClassName: PropTypes.string,
    showNotifications: PropTypes.bool,
  }

  static childContextTypes = {
    moduleLoader: PropTypes.object
  }

  static defaultProps = {
    showNotifications: true
  }

  /**
   * Retruns child context
   *
   * @returns {Object}
   */
  getChildContext() {
    const {
      moduleLoader
    } = this.props

    return {
      moduleLoader
    }
  }

  /**
   * Sets default form options on mount
   */
  componentWillMount() {
    const queryString = window.location.search.replace(/^\?/, '')
    if (queryString !== '') {
      storage.set('queryString', queryString)
    }

    this.props.setDefaultFormOptions({
      fieldsValidationRunner: FormValidationUtils.validateForm,
      validationRunner: FormValidationUtils.validateForm,
      clearFieldsValidationOn: [ 'change' ],
      fieldsMaskRunner: inputMasking,
      onServerError: FormValidationUtils.onServerError
    })
  }

  /**
   * Top Level Application
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      locales,
      moduleLoader,
      routes,
      contextClassName,
      showNotifications,
    } = this.props

    let DevTools
    let AppstoreDevTools

    if (__DEV__) {
      DevTools = require('apollo-library/containers/DevTools').default
    }

    if (__DEVTOOLS__) {
      AppstoreDevTools = require('containers/AppstoreDevTools').default
    }

    return (
      <IntlProvider
        messages={locales && locales.get('messages', Map()).toObject()}
        formats={formats}
        locale={locales && locales.get('language')}
      >
        <div className={contextClassName}>
          <Modals />
          {showNotifications && <Notifications />}
          <Router appRoutes={routes} />
          {DevTools && !window.devToolsExtension && <DevTools />}
          {AppstoreDevTools && <AppstoreDevTools moduleLoader={moduleLoader} />}
        </div>
      </IntlProvider>
    )
  }

}

export default connect(state => ({
  locales: state.root.localisations,
  contextClassName: state.root.agendas.getIn([AS_AGENDA_SYSTEM, 'contextClassName'], '')
}), {
  setDefaultFormOptions
})(App)
