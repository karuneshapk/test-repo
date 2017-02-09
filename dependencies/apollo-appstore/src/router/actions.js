import { createComponentWrapper } from './utils'

export const AS_SET_ROUTES = '@@moduleRouter/SET_ROUTES'
export const AS_ROUTER_UPDATED = '@@moduleRouter/ROUTER_UPDATED'
export const AS_ROUTER_RESET = '@@moduleRouter/ROUTER_RESET'

/** Action creators */

export const routerUpdated = () => ({
  type: AS_ROUTER_UPDATED
})

export const routerReset = () => ({
  type: AS_ROUTER_RESET
})

const setRoutes = routes => ({
  type: AS_SET_ROUTES,
  routes
})

const traverseChildRoutes = (childRoutes, childrenModules) => childRoutes.map(route => {
  if (route.module) {
    const childModuleForRoute = childrenModules.find(module => (route.module === module.id))
    if (childModuleForRoute) {
      const childRoute = buildModuleRoutes(childModuleForRoute)

      if (route.component) {
        childRoute.component = createComponentWrapper(route.component, childRoute.component)
      }

      return {
        ...route,
        ...childRoute
      }
    }
  }
  return route
})

/**
 * Build routes for given module.
 * Transforms Route components into a structure.
 *
 * When there are no routes in module, it resolves as null (no routes -> skip)
 * If there are child routes it combines all children into one promise and waits until
 * all children are resolved, because there might be unloaded modules as children.
 *
 * @param {Object} moduleNode - entry module node
 * @returns {Object}
 */
const buildModuleRoutes = moduleNode => {
  if (!moduleNode) {
    return null
  }

  const {
    data: { routes }
  } = moduleNode

  if (routes) {
    if (routes.childRoutes) {
      routes.childRoutes = traverseChildRoutes(routes.childRoutes, moduleNode.children)
    }

    return routes
  } else {
    return null
  }
}

/** Actions */

/**
 * This is an action called from Router and it loads entry module and builds route structure.
 * If there is no such entry module available, we just throw an error as this shouldn't happen.
 *
 * @param {Object} moduleStructure - module's structure
 *
 * @returns {function}
 */
export const startRouter = moduleStructure => dispatch =>
  dispatch(setRoutes(buildModuleRoutes(moduleStructure)))
