/* global __DEV__ */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { createModuleWrapper } from '../modules'
import { startRouter, routerUpdated } from './actions'
import { isAuthenticated } from '../utils/auth'
import { createRouteFromReactElement } from './RouteUtils'
import { createComponentWrapper } from './utils'

const checkChildren = (route, parts) => {
  let childPath = ''

  if (route.childRoutes && parts.length) {
    route.childRoutes.some(child => {
      const path = checkRoutePath(child, parts)
      if (path) {
        /* change from * to / in url */
        childPath = path !== '*' ? path : '/'
        return true
      }

      return false
    })

  }

  return childPath
}

const checkRoutePath = (route, parts, moduleName) => {
  const routeName = route.name || route.module || moduleName
  const part = parts[0]

  const currentPath = route.path || ''

  const routeMatches = routeName === part
  const newParts = routeMatches ? parts.slice(1) : parts

  let childrenPath

  if (route.childRoutes && newParts.length) {
    childrenPath = checkChildren(route, newParts)
  }

  if (childrenPath) {
    return currentPath + childrenPath
  } else {
    if (newParts.length === 0) {
      return routeMatches ? currentPath : childrenPath
    } else {
      return ''
    }
  }
}

/**
 * Build reg exp for current path matching
 * @param {Array<string>} parts - parts of the path splitted by /
 * @returns {RegExp}
 */
const buildMatchRe = parts => {
  /*
   * this creates a matching pattern for combinations of paths
   * Example:
   *  ['module', 'resource', 'detail'] =>
   *  ['\\/module', '\\/module\\/resource\\/', '\\/module\\/resource\\/detail']
   *
   * Current path can match only some subset of remaining parts
   */
  const partsRe = parts.reduce((accu, part) => {
    if (accu.length) {
      const prev = accu[accu.length - 1]
      accu.push(`${prev}\\/${part}`)
    } else {
      accu.push(`\\/${part}`)
    }

    return accu
  }, [])

  /*
   * This creates a regexp
   * Example:
   *  ['module', 'resource', 'detail'] =>
   *  ^(\/module|\/module\/resource|\/module\/resource\/detail|\*)$
   */
  return new RegExp(
    '^(' +
    partsRe.join('|') +
    '|' +
    '\\*' +
    ')$'
  )
}

/**
 * Apollo Router implementation
 *
 * This is custom Router implementation that is connected to redux flow.
 * redux-router manages handling of path and propagetes it into routing scope in
 * store.
 *
 * This component's responsibility is to invoke routes gathering and then
 * matching.
 * On mount it dispatches startRoute that goes through modules and their routes,
 * loads what's not loaded and prepares a structure which this router can
 * process and stores it into router scope in store.
 *
 * @module
 */
class Router extends Component {

  static propTypes = {
    appRoutes: PropTypes.object.isRequired,
    startRouter: PropTypes.func.isRequired,
    routerUpdated: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    search: PropTypes.string,
  };

  static contextTypes = {
    moduleLoader: PropTypes.object
  };

  static childContextTypes = {
    router: PropTypes.object
  };

  /**
   * @constructor
   */
  constructor(...args) {
    super(...args)

    this.content = false
  }

  /**
   * Returns child context
   *
   * @returns {Object}
   */
  getChildContext() {
    const {
      routes,
      moduleName: entryModuleName
    } = this.props


    const linkTo = path => {
      const parts = path.split('.')
      const resolvedPath = checkRoutePath(routes, parts, entryModuleName)
      return resolvedPath
    }

    return {
      router: {
        linkTo,
        goTo: (...args) => this.props.push(linkTo(...args))
      }
    }
  }

  /**
   * Start route matching on component mount
   */
  componentDidMount() {
    this.startRouter()
  }

  /**
   * If module name was changed and component was reused, start route
   * matching like in initial mount
   *
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.routes) {
      this.startRouter()
    } else if (nextProps.needsUpdate) {
      this.prepareCurrentRouteContent(nextProps)
    }
  }

  /**
   * Check whether we should update router or not
   * @param {Object} newProps props
   *
   * @returns {boolean}
   */
  shouldComponentUpdate(newProps) {
    if (newProps.needsUpdate) {
      this.props.routerUpdated()
    }

    return newProps.needsUpdate
  }

  /**
   * Prepares router content based on props
   * @param {Object} props
   */
  prepareCurrentRouteContent(props) {
    if (props.needsUpdate) {
      const {
        moduleLoader
      } = this.context

      const {
        routes,
        search
      } = props

      const {
        pathname
      } = window.location

      const query = search.split('?')[1]
      const params = query ? query.split('&').reduce((params, param) => {
        const paramMatch = param.match(/^([^=]+)=(.*)/)

        if (paramMatch) {
          const [paramKey, paramValue] = paramMatch.slice(1)

          if (paramKey) {
            params[paramKey] = paramValue
          }
        }

        return params
      }, {}) : {}

      const rootRoute = this.buildComponents(pathname || '', routes)

      if (rootRoute) {
        this.content = this.createComponentsHierarchy(rootRoute, { params })

        const getModules = route => route
          ? [ route.module, ...getModules(route.children) ]
          : [ ]

        const modules = getModules(rootRoute)
        moduleLoader.setActiveRouterModules(modules.filter(module => module))
      } else {
        this.content = this.renderNotFound(routes.onNotFound)
      }
    }
  }

  /**
   * Process app routes
   * @param {Object} appRoutes
   * @returns {Object}
   */
  getRootRoute() {
    const {
      appRoutes,
    } = this.props

    const appRoute = createRouteFromReactElement(appRoutes)
    const childRoutes = appRoute.childRoutes

    const rootRoute = isAuthenticated()
      ? childRoutes.find(route => route.private)
      : childRoutes.find(route => route.public)

    // Wrap root route with app route component
    if (appRoute.component) {
      return {
        ...rootRoute,
        component: createComponentWrapper(appRoute.component, rootRoute.component)
      }
    } else {
      return rootRoute
    }
  }

  /**
   * Loads modules and starts router
   *
   * @param {string} entryModuleName - entry module
   */
  startRouter() {
    const {
      startRouter,
    } = this.props

    const {
      moduleLoader
    } = this.context

    const rootRoute = this.getRootRoute()

    if (rootRoute.path === '/') {
      delete rootRoute.path
    }

    moduleLoader.loadModules(rootRoute)
      .then(modules => startRouter(modules))
  }

  /**
   * Creates a structure for route definition used by this router
   *
   * @param {Object} route - a route object created by startRouter action
   * @param {Object?} children - subroutes for given route
   *
   * @returns {Object}
   */
  createRoute(route, children) {
    const {
      component,
      props,
      module
    } = route

    return {
      component,
      module,
      props,
      children
    }
  }

  /**
   * Processed given route, transforms it into structure this router can process
   *
   * @param {Object} route - processed route
   * @param {Array<string>} parts - parts of path
   * @param {Object?} props - additional props
   *
   * @returns {Object?}
   */
  processRoute(route, parts, props) {
    let matchingChild = false

    if (route.childRoutes) {
      route.childRoutes.some(childRoute =>
        matchingChild = this.matchRoute(parts, route, childRoute, props)
      )
    }

    if (!matchingChild && parts.length && route.path !== '*') {
      return false
    }

    const componentRoute = route.component
      ? this.createRoute(route, matchingChild)
      : matchingChild

    if (route && componentRoute && route.module) {
      // if some child component has no module it means it belongs to the scope
      // of this route's module
      if (!componentRoute.module) {
        componentRoute.module = route.module
      }

      if (componentRoute.component) {
        componentRoute.component = createModuleWrapper(componentRoute.component, route.module)
      }
    }

    return componentRoute
  }

  /**
   * Matches current path and builds components tree accoring the path and
   * routes structure
   *
   * @param {Array.<string>} parts - parts of path divided by /
   * @param {Object} parentRoute - parentRoute
   * @param {Object} route - current route
   * @param {Object} props - additional props
   *
   * @returns {Object?}
   */
  matchRoute(parts, parentRoute, route, props = {}) {
    const part = '/' + parts[0]

    let indexRoute

    if (!route) {
      return false
    }

    // !!! this is on purpose - we need a copy of the object
    // so we don't update the original route object

    if (parentRoute && parentRoute.onNotFound && !route.onNotFound) {
      route.onNotFound = parentRoute.onNotFound
    }

    if (parentRoute) {
      if (parentRoute.props) {
        route.props = { ...parentRoute.props, ...(route.props || {}) }
      }
    }

    const routePath = route.path

    if (route.index) {
      indexRoute = route
    } else if (routePath) {
      const matchRe = buildMatchRe(parts)

      // if some part matches, continue
      if (matchRe.test(routePath)) {

        // for next match matched parts are removed,
        // so if we matched path /some/path, two parts should be removed
        const result = this.processRoute(
          route,
          routePath === '*' ? parts : parts.slice(routePath.split('/').length - 1),
          props
        )

        // if there was a successful match in children,
        // return this result, otherwise continue in matching
        if (result) {
          return result
        }
      }
    } else if (!routePath) {
      return this.processRoute(
        route,
        parts,
        props
      )
    }

    if (indexRoute && (!parts.length || part === '/')) {
      return this.processRoute(indexRoute, [], props)
    }

    return false
  }

  /**
   * Create elements from components
   *
   * @param {Object} route - a route with component and children created by
   *   createRoute
   * @param {Object} props - properties to be passed to route's component
   *
   * @returns {ReactNode}
   */
  createComponentsHierarchy(route, props) {
    if (!route) {
      return null
    }

    var componentProps = route.props || {}

    return React.createElement(
      route.component,
      { ...props, ...componentProps },
      route.children
        ? this.createComponentsHierarchy(route.children, props)
        : React.createElement('span')
    )
  }

  /**
   * Renders not found page
   * @param {function} NotFoundComponent
   * @returns {ReactElement}
   */
  renderNotFound(NotFoundComponent) {
    if (NotFoundComponent) {
      return React.createElement(NotFoundComponent)
    }

    if (__DEV__) {
      return React.createElement(() => <span>{'Not Found'}</span>)
    }

    return false
  }

  /**
   * Builds components tree for given path
   *
   * @param {string} path - current router's path
   * @param {Array}  routes - routes built by startRouter action
   *
   * @returns {ReactNode}
   */
  buildComponents(path, routes) {
    const parts = path.split('/').splice(1)

    // If we have routes, we know that in the beginning there should always be a
    // root route (routes[0])
    // and also there should be some subroutes (routes[1]). If there are no
    // subroutes or path doesn't
    // match any routes, matchRoute returns false.
    if (routes) {
      return this.matchRoute(parts, null, routes)
    } else {
      return null
    }
  }

  /**
   * Renders routing tree
   *
   * @returns {ReactNode}
   */
  render() {
    return this.content
  }

}

export default connect(state => {
  const { router } = state

  const routes = router.get('routes')
  const needsUpdate = router.get('needsUpdate')

  const {
    search
  } = window.location

  return {
    routes,
    search,
    needsUpdate
  }
}, {
  startRouter,
  push,
  routerUpdated
})(Router)
