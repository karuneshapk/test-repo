import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import { connect } from 'react-redux'

import ImmutablePropTypes from 'react-immutable-proptypes'

import './AppstoreDevTools.sass'

const KEY_CODES = {
  TILDA: 192,
  BACKSLASH: 220
}

const MODULE_STATUS = {
  ERROR: 'danger',
  LOADED: 'success',
  LOADING: 'info',
  NOT_LOADED: 'warning'
}

const TAB_NAMES = {
  AVAILABLE: 'available',
  LOADED: 'loaded',
  ENVIRONMENT: 'environment',
  SERVICES: 'services',
  STRUCTURE: 'structure',
  DETAIL: 'detail'
}

const DEFAULT_TAB = TAB_NAMES.AVAILABLE

 /**
 * DevTools For Modules in Appstore
 */
export class AppstoreDevTools extends Component {

  static propTypes = {
    moduleLoader: PropTypes.object,
    modules: ImmutablePropTypes.map
  }

  /**
   * @constructor
   */
  constructor(...args) {
    super(...args)

    this.state = {
      visible: false,
      currentTab: DEFAULT_TAB
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  /**
   * Bind key event
   */
  componentDidMount() {
    const {
      moduleLoader
    } = this.props

    window.addEventListener('keydown', this.handleKeyDown)
    window.moduleLoader = moduleLoader
  }

  /**
   * Unbind key event
   */
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    delete window.moduleLoader
  }

  /**
   * Handles key event
   *
   * @param {Event} e
   */
  handleKeyDown(e) {
    // Ignore regular keys when focused on a field
    // and no modifiers are active.

    if ((
      !e.ctrlKey && !e.metaKey && !e.altKey
    ) && (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'SELECT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    )) {
      return
    }

    const charCode = e.keyCode || e.which

    if ((charCode === KEY_CODES.TILDA || charCode === KEY_CODES.BACKSLASH) && e.ctrlKey) {
      e.preventDefault()
      this.setState({ visible: !this.state.visible })
    }
  }

  /**
   * Shows module's detail
   * @param {Object} module module to show
   */
  showModuleDetail(module) {
    this.setState({
      currentTab: TAB_NAMES.DETAIL,
      module
    })
  }

  /**
   * Gets module's status code/class
   * @param {Object} module module to get status of
   * @returns {string}
   */
  getModuleStatus(module) {
    const {
      moduleLoader
    } = this.props

    const error = module.lastError
    if (error) {
      return MODULE_STATUS.ERROR
    }

    const isLoading = moduleLoader.isModuleLoading(module.name)
    if (isLoading) {
      return MODULE_STATUS.LOADING
    }

    const isLoaded = moduleLoader.isModuleLoaded(module.name)
    if (isLoaded) {
      return MODULE_STATUS.LOADED
    }

    return MODULE_STATUS.NOT_LOADED
  }


  /**
   * Sets current tab
   * @param {string} currentTab
   */
  setTab(currentTab) {
    this.setState({ currentTab })
  }

  /**
   * Renders tick or cross if module has/has not a property
   * @param {Object} module
   * @param {string} prop property of module
   *
   * @returns {string}
   */
  renderHasModuleProp(module, prop) {
    return module[prop] ? '✅ ' : '❌ '
  }

  /**
   * Renders environment variables
   *
   * @returns {ReactNode}
   */
  renderEnvironment() {
    const {
      modules
    } = this.props

    const rows = []

    const environment = modules.get('environment')
    Object.keys(environment).forEach(envKey => rows.push(
      <tr key={`env_${envKey}`}>
        <td>{envKey}</td>
        <td>{environment[envKey]}</td>
      </tr>
    ))

    return (
      <div className="col-md-offset-1 col-md-9">
        <table className="table table-striped">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

  /**
   * Renders services
   *
   * @returns {ReactNode}
   */
  renderServices() {
    const {
      modules
    } = this.props

    const rows = []

    const services = modules.get('services')

    services.forEach((path, service) => rows.push(
      <tr key={`service_${service}`}>
        <td>{service}</td>
        <td>{path}</td>
      </tr>
    ))

    return (
      <div className="col-md-offset-1 col-md-9">
        <table className="table">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

  /**
   * Renders modules status
   *
   * @param {string} status module status code
   * @param {Object} module
   *
   * @returns {string}
   */
  renderModuleStatusText(status, module) {
    switch (status) {
      
      case MODULE_STATUS.NOT_LOADED: {
        return 'Not loaded'
      }

      case MODULE_STATUS.LOADING: {
        return 'Loading ...'
      }

      case MODULE_STATUS.LOADED: {
        return 'Loaded'
      }

      case MODULE_STATUS.ERROR: {
        return `Error ${(module.lastError || {}).message}`
      }

    }

    return ''
  }

  /**
   * Renders available modules table
   *
   * @returns {ReactNode}
   */
  renderAvailableModules() {
    const {
      moduleLoader
    } = this.props

    const availableModules = moduleLoader.getAvailableModules()
    const rows = []

    availableModules.forEach(module => {
      const moduleStatus = this.getModuleStatus(module)
      const isMounted = moduleLoader.isModuleMounted(module.name)

      rows.push(
        <tr
          className={moduleStatus}
          key={`available_${module.name}`}
        >
          <td>{module.name}</td>
          <td>{module.api}</td>
          <td>{module.ui}</td>
          <td>
            {this.renderModuleStatusText(moduleStatus, module)}
          </td>
          <td>
            {isMounted ? '✅ ' : '❌ '}
          </td>
        </tr>
      )
    })

    return (
      <div className="row">
        <div className="col-md-offset-1 col-md-10">
          <table className="table">
            <thead>
              <tr key={'overview_header'}>
                <th>{'Module name'}</th>
                <th>{'Pula file location'}</th>
                <th>{'UI file location'}</th>
                <th>{'Module status'}</th>
                <th>{'Module is mounted'}</th>
              </tr>
            </thead>
            <tbody className="overview">
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /**
   * Renders loaded modules table
   *
   * @returns {ReactNode}
   */
  renderLoadedModules() {
    const {
      moduleLoader
    } = this.props

    const loadedModules = moduleLoader.getLoadedModules()
    const rows = []

    loadedModules.forEach(module => rows.push(
      <tr key={`loaded_${module.name}`}>
        <td>
          <strong>{module.name}</strong>
        </td>
        <td>
          {this.renderHasModuleProp(module, 'MainView')}
        </td>
        <td>
          {this.renderHasModuleProp(module, 'reducer')}
        </td>
        <td>
          {this.renderHasModuleProp(module, 'routes')}
        </td>
        <td>
          {this.renderHasModuleProp(module, 'shared')}
        </td>
        <td>
          {module.api
            ? (
              <button
                className="btn btn-xs btn-info"
                onClick={() => this.showModuleDetail(module)}
              >
                {`${Object.keys(module.api).length} methods`}
              </button>
            )
            : '❌ '
          }
        </td>
      </tr>
    ))

    return (
      <div className="row">
        <div className="col-md-offset-1 col-md-10">
          <table className="table table-striped">
            <thead>
              <tr key={'loaded_header'}>
                <th>{'Module name'}</th>
                <th>{'MainView'}</th>
                <th>{'reducer'}</th>
                <th>{'routes'}</th>
                <th>{'shared'}</th>
                <th>{'api (pula)'}</th>
              </tr>
            </thead>
            <tbody className="loaded">
              {rows}
            </tbody>
          </table>
        </div>
      </div>

    )
  }

  /**
   * Renders module detail
   *
   * @returns {ReactNode}
   */
  renderModuleDetail() {
    const {
      module
    } = this.state

    if (!module) {
      return null
    }

    const {
      api
    } = module

    const rows = []

    Object.keys(api).forEach(methodName => {
      const pula = api[methodName] || {}

      const {
        service,
        endpoint,
        method
      } = pula

      rows.push(
        <tr>
          <td>{methodName}</td>
          <td>{method}</td>
          <td>{service}</td>
          <td>{endpoint}</td>
        </tr>
      )
    })

    return (
      <div>
        <button
          onClick={() => this.setTab(TAB_NAMES.LOADED)}
          className="btn btn-primary"
        >
          {'Back'}
        </button>

        <h3><span className="label label-info">{module.name}</span></h3>
        <h4><span className="label label-warning">{'API'}</span></h4>

        <div className="col-md-offset-1 col-md-8">
          <table className="table">
            <thead>
              <th>{'Method'}</th>
              <th>{'HTTP Method'}</th>
              <th>{'Service'}</th>
              <th>{'Endpoint'}</th>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /**
   * Renders tab button
   *
   * @param {string} tabId - name of tab (one of TAB_NAMES)
   * @param {string} tabName - label for button
   *
   * @returns {ReactNode}
   */
  renderTabButton(tabId, tabName) {
    const isActive = tabId === this.state.currentTab
    const className = `btn btn-sm ${isActive ? 'btn-primary' : 'btn-default'}`

    return (
      <button
        className={className}
        onClick={() => this.setTab(tabId)}
      >
        {tabName}
      </button>
    )
  }

  /**
   * Renders modules structure
   *
   * @returns {ReactNode}
   */
  renderModulesStructure() {
    const {
      moduleLoader
    } = this.props

    const rootNode = moduleLoader.getRootModuleNode()
    if (!rootNode) {
      return (
        <span className="alert alert-danger">
          {'No root module found, probably entry module failed to load'}
        </span>
      )
    }

    const renderNode = (node, level = 1) => {
      return (
        <div>
          <div style={{ width: `${level * 1.8}em`, display: 'inline-block' }} />
          {node.id}
          {node.children &&
            node.children.map(child => renderNode(child, level + 1))
          }
        </div>
      )
    }

    return (
      <code className="modules-structure col-md-6 col-md-offset-3" >
        {renderNode(rootNode)}
      </code>
    )
  }

  /**
   * Renders current tabs content
   *
   * @returns {ReactNode}
   */
  renderCurrentTab() {
    switch (this.state.currentTab) {
      
      case TAB_NAMES.AVAILABLE: {
        return this.renderAvailableModules()
      }

      case TAB_NAMES.LOADED: {
        return this.renderLoadedModules()
      }

      case TAB_NAMES.SERVICES: {
        return this.renderServices()
      }

      case TAB_NAMES.ENVIRONMENT: {
        return this.renderEnvironment()
      }

      case TAB_NAMES.DETAIL: {
        return this.renderModuleDetail()
      }

      case TAB_NAMES.STRUCTURE: {
        return this.renderModulesStructure()
      }

    }

    return null
  }

  /**
   * Renders dev tools dock
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      visible
    } = this.state

    const {
      modules
    } = this.props

    const context = modules.get('context')
    const entryModule = modules.get('entryModule')

    return (
      <Dock
        position="bottom"
        isVisible={visible}
        dimMode="none"
        dockStyle={{
          backgroundColor: '#5e5e5e'
        }}
      >
        <div id="appstore-dev-tools">
          <div className="tabbar">
            <div className="row">
              <div className="col-md-9">
                {this.renderTabButton(TAB_NAMES.AVAILABLE, 'Overview')}
                {this.renderTabButton(TAB_NAMES.LOADED, 'Loaded Modules')}
                {this.renderTabButton(TAB_NAMES.ENVIRONMENT, 'Environment')}
                {this.renderTabButton(TAB_NAMES.SERVICES, 'Services')}
                {this.renderTabButton(TAB_NAMES.STRUCTURE, 'Structure')}
              </div>
              <div className="col-md-3 text-right context">
                <div>{`${entryModule}, ${context}`}</div>
              </div>
            </div>
          </div>
          <div className="tab-content">
            {this.renderCurrentTab()}
          </div>
        </div>
      </Dock>
    )
  }
}

export default connect(state => ({
  modules: state.root.modules
}))(AppstoreDevTools)
