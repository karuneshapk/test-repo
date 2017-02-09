/* global __DEV__ */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

/**
 * Container for a module. If module provides a MainView, such view is displayed
 * inside this container.
 */
export class Module extends Component {

  static propTypes = {
    options: PropTypes.object,
    moduleName: PropTypes.string.isRequired,
    renderModule: PropTypes.bool.isRequired
  }

  static defaultProps = {
    options: {}
  }

  static contextTypes = {
    moduleLoader: PropTypes.object
  }

  /**
   * Check if module is loaded before mounting it
   */
  componentDidMount() {
    this.checkModuleLoad(this.props)
  }

  /**
   * We can assume that availableModules.size is incresing only as we don't remove modules,
   * only append. So whenever the size changes, there were new modules.
   *
   * For more, see modules reducer how available is populated
   *
   * @param {Object} newProps
   */
  componentWillReceiveProps(newProps) {
    if (newProps.ready) {
      this.checkModuleLoad(newProps)
    }
  }

  /**
   * Trigger update only when app is ready
   *
   * @param {Object} nextProps - new props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.ready
  }

  /**
   * Set state not loaded when we remove this container
   */
  componentWillUnmount() {
    this.context.moduleLoader.setModuleMountState(this.props.moduleName, true)
  }

  /**
   * Checkes whether module is already loaded, if not dispatches load module action
   *
   * @param {Object} props - component's props
   */
  checkModuleLoad(props) {
    const { moduleLoader } = this.context
    const { moduleName } = props

    if (!moduleLoader.isModuleLoaded(moduleName)) {
      moduleLoader.loadModule(moduleName).then(() => {
        moduleLoader.setModuleMountState(moduleName, true)
      })
    }
  }

  /**
   * Renders Module
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      moduleLoader
    } = this.context

    const {
      moduleName,
      options,
      renderModule
    } = this.props

    if (!renderModule) {
      return null
    }

    const loadedModule = moduleLoader.getLoadedModule(moduleName)

    if (loadedModule) {
      const ModuleComponent = loadedModule.root

      return ModuleComponent
        ? <ModuleComponent {...options} />
        : <div>{ __DEV__ && `Module [${moduleName}] is missing root view ...`}</div>
    } else {
      if (__DEV__) {
        return (
          <div>
            {`Module [${moduleName}] load failed ...`}
          </div>
        )
      }
    }

    return null
  }
}

export default connect((state, props) => {
  const { modules } = state.root

  return {
    ready: modules.get('ready'),
    renderModule: modules.hasIn(['loaded', props.moduleName])
  }
})(Module)
