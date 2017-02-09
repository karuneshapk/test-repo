import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import invariant from 'invariant'

import { getObjectKeyByPath } from 'apollo-library/utils/object'
/**
 * Throws an error when there is no module name in context
 *
 * @param {Object} context - react context
 */
const invariantModuleContext = ({ moduleName } = {}) => {
  invariant(moduleName,
    '[Shared] Could not find required `moduleName` property.'
  )
}

/**
 * Creates a wrapper for sharing interface
 *
 * @param {Array|function} injectPropsOrComponent
 * @param {function} OptionalWrappedComponent - component to be wrapped
 *
 * @returns {function}
 */
const createWrappedComponent = (injectPropsOrComponent, OptionalWrappedComponent) => {
  const WrappedComponent = Array.isArray(injectPropsOrComponent)
    ? OptionalWrappedComponent
    : injectPropsOrComponent

  const injectSharedProps = Array.isArray(injectPropsOrComponent)
    ? injectPropsOrComponent
    : []

  /**
   * Wrapping class for rights
   */
  class SharedInterface extends Component {

    static propTypes = {
      shared: ImmutablePropTypes.map.isRequired
    }

    static contextTypes = {
      moduleName: PropTypes.string.isRequired,
      moduleLoader: PropTypes.object.isRequired
    }

    /**
     * Checks whether module name is provided in context
     *
     * @param {Object} props - props
     * @param {Object} context - context
     */
    constructor(props, context) {
      super(props, context)

      invariantModuleContext(context)

      this.sharedGet = this.sharedGet.bind(this)
      this.sharedSet = this.sharedSet.bind(this)
      this.getConfig = this.getConfig.bind(this)

      this.updateSharedProps(this.props)
    }

    /**
     * Updates shared data for component
     *
     * @param {Object} nextProps
     */
    componentWillReceiveProps(nextProps) {
      this.updateSharedProps(nextProps)
    }

    /**
     * Updates shared props with current values
     *
     * @param {Object} props
     */
    updateSharedProps(props) {
      this.sharedProps = injectSharedProps.reduce((set, key) => {
        set[key] = this.sharedGet(props, key)
        return set
      }, {})
    }

    /**
     * Gets shared config
     * @param {?string} path - path of the objects structure to return
     * @returns {?Object}
     */
    getConfig(path) {
      const sharedConfig = this.props.shared.get('config')

      if (!sharedConfig) {
        return null
      }

      if (!path) {
        return sharedConfig
      }

      return getObjectKeyByPath(sharedConfig, path)
    }

    /**
     * Gets shared data for current module
     *
     * @param {Object} props
     * @param {string} key
     *
     * @returns {*}
     */
    sharedGet(props, key) {
      const {
        moduleName
      } = this.context

      const {
        shared,
      } = props

      const moduleData = shared.getIn(['modules', moduleName])
      return moduleData ? moduleData[key] : undefined
    }

    /**
     * Sets shared dynamic value
     *
     * @param {string} key
     * @param {*} value
     */
    sharedSet(...args) {
      const {
        moduleLoader,
        moduleName
      } = this.context

      moduleLoader.setShared(moduleName, ...args)
    }
    /**
     * Renders wrapped component
     *
     * @returns {ReactNode}
     */
    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.sharedProps}
          getConfig={this.getConfig}
          setShared={this.sharedSet}
        />
      )
    }

  }

  return connect(state => ({
    shared: state.root.shared
  }))(SharedInterface)
}

/**
 * Inject shared interface into a component
 *
 * @param {Array<String>} injectSharedProps - a list of shared data to provide
 *  to component
 * @param {ReactNode} WrappedComponent - component to be wrapped with rights
 *
 * @returns {ReactNode}
 */
export const injectShared = createWrappedComponent
