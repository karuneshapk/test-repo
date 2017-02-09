import React, { Component, PropTypes } from 'react'
import invariant from 'invariant'

/**
 * Throws an error when there is no module name in context
 *
 * @param {Object} context - react context
 */
const invariantModuleContext = ({ moduleName, router } = {}) => {
  invariant(moduleName,
    `[Router] Could not find required 'moduleName' property.
     You can inject router only into module components.`
  )

  invariant(router,
    `[Router] Could not find required 'router' property. You can inject router
    decorator only to components used within Route components and its children`
  )
}

/**
 * Get link path
 * @param {string} moduleName
 * @param {string} path
 * @returns {string}
 */
const getPath = (moduleName, path) => {
  if (path.match(/^\^/)) {
    return path.replace(/^\^/, '')
  } else {
    return `${moduleName}.${path}`
  }
}

/**
 * Inject router into a component
 *
 * @param {ReactNode} WrappedComponent - component to be wrapped with router
 * @returns {ReactNode}
 */
export const injectRouter = WrappedComponent => {

  /**
   * Wrapping class for rights
   */
  class RouterWrapper extends Component {

    static contextTypes = {
      moduleName: PropTypes.string.isRequired,
      router: PropTypes.object.isRequired
    };

    /**
     * Checks whether module name is provided in context
     *
     * @param {Object} props - props
     * @param {Object} context - context
     */
    constructor(props, context) {
      super(props, context)
      invariantModuleContext(context)
    }

    /**
     * Renders wrapped component
     *
     * @returns {ReactNode}
     */
    render() {
      const {
        moduleName,
        router
      } = this.context

      return (
        <WrappedComponent
          {...this.props}
          linkTo={path => router.linkTo(getPath(moduleName, path))}
          goTo={path => router.goTo(getPath(moduleName, path))}
        />
      )
    }
  }

  RouterWrapper.wrappedComponent = WrappedComponent

  return RouterWrapper
}
